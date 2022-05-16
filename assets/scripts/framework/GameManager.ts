import {
  _decorator,
  Component,
  Node,
  Prefab,
  Sprite,
  randomRangeInt,
  Button,
  director,
  SpriteFrame,
  misc,
} from "cc"
import { Bullet } from "../bullet/Bullet"
import { movingSceneBg } from "../movingSceneBg"
import { EnemyPlane } from "../plane/EnemyPlane"
import { EnemyRoot } from "./EnemyRoot"
import { PoolManager } from "./PoolManager"
const { ccclass, property } = _decorator

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Node)
  public playerPlane: Node = null
  @property({ group: { name: "bullet01", id: "1" }, type: Prefab })
  public bullet01: Prefab = null
  @property({ group: { name: "bullet01", id: "1" } })
  public shootTime = 0.3
  @property({ group: { name: "bullet01", id: "1" } })
  public bulletSpeed = 1
  @property({ group: { name: "root" }, type: Node })
  public bulletRoot: Node = null
  @property(EnemyRoot)
  public enemyRoot: EnemyRoot = null

  // 暂停按钮相关配置
  @property(Button)
  public pauseBtn: Button = null
  @property({ type: [SpriteFrame], tooltip: "暂停按钮不同状态下的图片" })
  public btnSprite: SpriteFrame[] = []

  @property(movingSceneBg)
  public background: movingSceneBg = null

  // 游戏的几个场景，包含开始界面、暂停界面、结算界面等
  @property(Node)
  public gameStart: Node = null
  @property(Node)
  public gamePlaying: Node = null
  @property(Node)
  public gameEnd: Node = null

  // 游戏的重要逻辑，判断游戏状态，状态有'stop','playing','pause'
  public gameState = "stop"

  private _currentShootTime = 0
  private _isShooting = false

  //  玩家分数
  private _score = 0

  /**
   * @description GameManager是控制整个游戏流程的脚本，start是脚本第一次激活触
   * 发的函数也就可以看作整个游戏的入口；此处将游戏开始界面展示，其他隐藏，等待玩家点
   * 击开始按钮后开始游戏
   */
  start() {
    this.gameStart.active = true
    this.gamePlaying.active = false
    this.gameEnd.active = false
  }

  update(deltaTime: number) {
    if (this.gameState == "playing") {
      this._currentShootTime += deltaTime
      if (this._isShooting && this._currentShootTime > this.shootTime) {
        this.createPlayerBullet()
        this._currentShootTime = 0
      }
    }
  }
  // 点击开始游戏执行的函数
  clickToStartGame() {
    this.gameStart.active = false
    this.gamePlaying.active = true
    this.gameState = "playing"
    this.enemyRoot.startAction()
  }
  // 游戏暂停
  gamePause() {
    if (this.gameState == "playing") {
      this.gameState = "pause"
      this.enemyRoot.pauseAction()
      this.background.pauseAction()
      this.pauseBtn.normalSprite = this.btnSprite[2]
      this.pauseBtn.pressedSprite = this.btnSprite[3]
    } else {
      this.gameState = "playing"
      this.enemyRoot.resumeAction()
      this.background.resumeAction()
      this.pauseBtn.normalSprite = this.btnSprite[0]
      this.pauseBtn.pressedSprite = this.btnSprite[1]
    }
  }

  // 游戏重启
  gameRestart() {
    this.gamePlaying.active = true
    this.gameEnd.active = false
  }

  // 游戏结束
  gameOver() {
    this.gamePlaying.active = false
    this.gameEnd.active = true
    this.enemyRoot.node.removeAllChildren()
    this.playerPlane.setPosition(5, -310)
  }

  public createPlayerBullet() {
    // const bullet = instantiate(this.bullet01)
    const bullet = PoolManager.instance().getNode(
      this.bullet01,
      this.bulletRoot
    )
    const pos = this.playerPlane.position
    bullet.setPosition(pos.x, pos.y + 80)
    const bulletComp = bullet.getComponent(Bullet)
    bulletComp.bulletSpeed = this.bulletSpeed
  }

  public addScore(score: number) {
    this._score += score
    console.log(this._score)
  }
  public changeBullet() {
    console.log("改变子弹类型")
  }

  public bomb() {
    console.log("炸弹来啦")
  }
  // 随机生成x坐标，传入飞机宽度
  public generateRandomX(width: number) {
    const range = 320 - width
    const rand = randomRangeInt(-range, range)
    return rand
  }

  public isShooting(value: boolean) {
    this._isShooting = value
  }
}
