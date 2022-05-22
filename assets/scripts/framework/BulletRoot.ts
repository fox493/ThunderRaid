import { _decorator, Component, Node, Prefab } from "cc"
import { Constant } from "./Constant"
import { GameManager } from "./GameManager"
import { PoolManager } from "./PoolManager"
const { ccclass, property } = _decorator

@ccclass("Bullet")
export class Bullet {
  @property
  public name = ""
  @property
  public fireSpeed = 0
  @property(Prefab)
  public prefab: Prefab = null
}

@ccclass("BulletRoot")
export class BulletRoot extends Component {
  @property({ type: [Bullet] })
  public bulletGroup: Bullet[] = []
  @property(Node)
  public playerPlane: Node = null
  @property(Node)
  public gameManagerNode: Node = null
  // 子弹速度
  public fireSpeed: number = 0
  // 初始速度
  public initFireSpeed: number = 0
  // 判断当前游戏状态
  public isStop = false
  // 双倍子弹
  public doubleBullet = 0
  public gameManager: GameManager = null
  /**
   * @dev 每种子弹预制生成相应的回调函数（用于定时器），默认使用第一种子弹
   */
  startAction() {
    this.fireSpeed = this.bulletGroup[0].fireSpeed
    this.initFireSpeed = this.fireSpeed
    for (let i = 0; i < this.bulletGroup.length; i++) {
      const fName = "callback_" + i
      this[fName] = function (e: number) {
        this.fire(this.bulletGroup[e])
      }.bind(this, i)
    }
    this.schedule(this["callback_0"], this.fireSpeed)
    this.gameManager = this.gameManagerNode.getComponent(GameManager)
  }

  pauseAction() {
    this.isStop = true
  }

  resumeAction() {
    this.isStop = false
  }

  overAction() {
    this.node.removeAllChildren()
    this.doubleBullet = 0
    this.fireSpeed = this.initFireSpeed
  }

  fire(bulletInfo: Bullet) {
    if (this.isStop) return
    const score = this.gameManager.score
    switch (true) {
      case score > Constant.gameStage.level_2:
        this.fireSpeed -= 0.04
        break
      case score > Constant.gameStage.level_2:
        this.fireSpeed -= 0.04
        break
      case score > Constant.gameStage.level_3:
        this.fireSpeed -= 0.04
        break
      case score > Constant.gameStage.level_4:
        this.fireSpeed -= 0.04
        break
    }
    if (!this.doubleBullet) {
      const bullet = PoolManager.instance().getNode(
        bulletInfo.prefab,
        this.node
      )
      const player_pos = this.playerPlane.position
      bullet.setPosition(player_pos.x, player_pos.y + 80)
    } else {
      const bullet_line_1 = PoolManager.instance().getNode(
        bulletInfo.prefab,
        this.node
      )
      const bullet_line_2 = PoolManager.instance().getNode(
        bulletInfo.prefab,
        this.node
      )
      const player_pos = this.playerPlane.position
      bullet_line_1.setPosition(player_pos.x - 30, player_pos.y + 80)
      bullet_line_2.setPosition(player_pos.x + 30, player_pos.y + 80)
      if (this.doubleBullet > 0) this.doubleBullet--
    }
  }

  /**
   * @description 根据游戏分数等级来改变双倍子弹数量
   */
  changeBulletType() {
    const score = this.gameManager.score
    switch (true) {
      case score <= Constant.gameStage.level_2:
        this.doubleBullet = 33
        break
      case score > Constant.gameStage.level_2:
        this.doubleBullet = 55
        break
      case score > Constant.gameStage.level_3:
        this.doubleBullet = 77
        break
      case score > Constant.gameStage.level_4:
        this.doubleBullet = 99
        break
    }
  }
}
