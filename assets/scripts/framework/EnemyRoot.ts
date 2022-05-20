import {
  _decorator,
  Component,
  Node,
  Prefab,
  randomRangeInt,
  v2,
  UITransform,
} from "cc"
import { EnemyPlane } from "../plane/EnemyPlane"
import { Constant } from "./Constant"
import { GameManager } from "./GameManager"
import { PoolManager } from "./PoolManager"
const { ccclass, property } = _decorator
@ccclass("Enemy")
export class Enemy {
  @property
  public name = ""
  @property
  public genTime = 0
  @property(Prefab)
  public prefab: Prefab = null
}
@ccclass("EnemyRoot")
export class EnemyRoot extends Component {
  @property({ type: [Enemy] })
  public enemyGroup: Enemy[] = []
  @property(Node)
  public gameManagerNode: Node = null
  public gameManager: GameManager = null
  public isStop = false
  public roll_rate = 1
  startAction() {
    for (let i = 0; i < this.enemyGroup.length; i++) {
      const genTime = this.enemyGroup[i].genTime
      const fName = "callback_" + i
      this[fName] = function (e: number) {
        this.generateNewEnemy(this.enemyGroup[e])
      }.bind(this, i)
      this.schedule(this[fName], genTime)
    }
    this.gameManager = this.gameManagerNode.getComponent(GameManager)
  }

  // 暂停事件
  pauseAction() {
    this.isStop = true
  }
  // 恢复事件
  resumeAction() {
    this.isStop = false
  }

  // 游戏结束
  overAction() {
    this.node.removeAllChildren()
    this.unscheduleAllCallbacks()
  }

  // 将死亡敌机分数传入gameManager
  addScore(score: number) {
    this.gameManager.addScore(score)
  }

  /**
   * @description 提升游戏难度的主要途径，提高同时生成两架敌机的可能性
   */
  roll() {
    const score = this.gameManager.score
    switch (true) {
      case score > Constant.gameStage.level_1:
        this.roll_rate = 2
        break
      case score > Constant.gameStage.level_2:
        this.roll_rate = 3
        break
      case score > Constant.gameStage.level_3:
        this.roll_rate = 4
        break
      case score > Constant.gameStage.level_4:
        this.roll_rate = 5
        break
    }
    const rand = randomRangeInt(1, 10)
    return rand <= this.roll_rate ? true : false
  }

  generateNewEnemy(enemyInfo: Enemy) {
    if (this.isStop) return
    const generate = () => {
      const enemyNode = PoolManager.instance().getNode(
        enemyInfo.prefab,
        this.node
      )
      const randPos = this.generateRandomPos(enemyNode)
      enemyNode.setPosition(randPos.x, randPos.y)
      enemyNode.getComponent(EnemyPlane).init()
    }
    if (this.roll()) {
      for (let i = 0; i < 2; i++) {
        generate()
      }
    } else generate()
  }

  generateRandomPos(enemy: Node) {
    const width = enemy.getComponent(UITransform).width
    const height = enemy.getComponent(UITransform).height
    const range = Constant.canvasInfo.width / 2 - width - 10
    const x = randomRangeInt(-range, range)
    const y = Constant.canvasInfo.height / 2 + height
    return v2(x, y)
  }

  // 炸弹清除所有敌机
  clearAllEnemies() {
    if (!this.gameManager.bombAmount) return
    const enemies = this.node.children
    for (let enemy of enemies) {
      enemy.getComponent(EnemyPlane).enemyDestroyed()
    }
    this.gameManager.subBomb()
  }
}
