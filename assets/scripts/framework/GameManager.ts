import {
  _decorator,
  Component,
  Node,
  Button,
  SpriteFrame,
  AudioSource,
  Label,
} from "cc"
import { movingSceneBg } from "../movingSceneBg"
import { SelfPlane } from "../plane/SelfPlane"
import { AirdropRoot } from "./AirdropRoot"
import { BulletRoot } from "./BulletRoot"
import { EnemyRoot } from "./EnemyRoot"
const { ccclass, property } = _decorator

@ccclass("GameManager")
export class GameManager extends Component {
  // 子节点配置
  @property(SelfPlane)
  public playerPlane:SelfPlane = null
  @property(EnemyRoot)
  public enemyRoot: EnemyRoot = null
  @property(BulletRoot)
  public bulletRoot: BulletRoot = null
  @property(AirdropRoot)
  public airdropRoot: AirdropRoot = null

  // 暂停按钮相关配置
  @property(Button)
  public pauseBtn: Button = null
  @property({ type: [SpriteFrame], tooltip: "暂停按钮不同状态下的图片" })
  public btnSprite: SpriteFrame[] = []

  // 滚动背景
  @property(movingSceneBg)
  public background: movingSceneBg = null

  // 游戏的几个场景，包含开始界面、暂停界面、结算界面等
  @property(Node)
  public gameStart: Node = null
  @property(Node)
  public gamePlaying: Node = null
  @property(Node)
  public gameEnd: Node = null

  // 游戏中展示分数Label
  @property(Label)
  public gameScore: Label = null
  // 游戏结束分数展示
  @property(Label)
  public gameEndScore: Label = null

  // 游戏Bgm
  public bgm: AudioSource = null

  // 游戏的重要逻辑，判断游戏状态，状态有'stop','playing','pause'
  public gameState = "stop"

  //  玩家分数
  public score = 0

  /**
   * @description GameManager是控制整个游戏流程的脚本，start是脚本第一次激活触
   * 发的函数也就可以看作整个游戏的入口；此处将游戏开始界面展示，其他隐藏，等待玩家点
   * 击开始按钮后开始游戏
   */
  start() {
    this.gameStart.active = true
    this.gamePlaying.active = false
    this.gameEnd.active = false
    this.bgm = this.getComponent(AudioSource)
  }
  // 点击开始游戏执行的函数
  clickToStartGame() {
    this.gameStart.active = false
    this.gamePlaying.active = true
    this.gameState = "playing"
    this.enemyRoot.startAction()
    this.airdropRoot.startAction()
    this.bulletRoot.startAction()
    // 播放音乐
    this.bgm.play()
  }

  // 游戏暂停或恢复
  gamePause() {
    if (this.gameState == "playing") {
      this.gameState = "pause"
      this.enemyRoot.pauseAction()
      this.airdropRoot.pauseAction()
      this.bulletRoot.pauseAction()
      this.background.pauseAction()
      this.playerPlane.offDrag()
      this.pauseBtn.normalSprite = this.btnSprite[2]
      this.pauseBtn.pressedSprite = this.btnSprite[3]
      this.bgm.pause()
    } else {
      this.gameState = "playing"
      this.enemyRoot.resumeAction()
      this.airdropRoot.resumeAction()
      this.bulletRoot.resumeAction()
      this.background.resumeAction()
      this.playerPlane.offDrag()
      this.pauseBtn.normalSprite = this.btnSprite[0]
      this.pauseBtn.pressedSprite = this.btnSprite[1]
      this.bgm.play()
    }
  }

  // 游戏重启
  gameRestart() {
    this.gamePlaying.active = true
    this.gameEnd.active = false
    this.bgm.play()
  }

  // 游戏结束
  gameOver() {
    this.gamePlaying.active = false
    this.gameEnd.active = true
    // 清理节点下挂载的对象
    this.enemyRoot.node.removeAllChildren()
    this.bulletRoot.overAction()
    this.airdropRoot.overAction()
    // 重置玩家飞机位置
    this.playerPlane.node.setPosition(5, -310)
    // bgm停止
    this.bgm.stop()
    // 分数清零
    this.gameEndScore.string = "本局得分:" + this.score.toString()
    this.gameScore.string = "Score:0"
    this.score = 0
  }

  // 改变子弹类型
  changeBulletType() {
    this.bulletRoot.changeBulletType()
  }

  addScore(score: number) {
    this.score += score
    this.gameScore.string = "Score:" + this.score.toString()
  }
}
