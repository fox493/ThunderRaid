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

  private _isStop = false

  startAction() {
    for (let i = 0; i < this.enemyGroup.length; i++) {
      const genTime = this.enemyGroup[i].genTime
      const fName = "callback_" + i
      this[fName] = function (e: number) {
        this.generateNewEnemy(this.enemyGroup[e])
      }.bind(this, i)
      this.schedule(this[fName], genTime)
    }
  }

  // 暂停事件
  pauseAction() {
    this._isStop = true
  }
  // 恢复事件
  resumeAction() {
      this._isStop = false
  }

  generateNewEnemy(enemyInfo: Enemy) {
    if (this._isStop) return
    const enemyNode = PoolManager.instance().getNode(
      enemyInfo.prefab,
      this.node
    )
    const randPos = this.generateRandomPos(enemyNode)
    enemyNode.setPosition(randPos.x, randPos.y)
    enemyNode.getComponent(EnemyPlane).init()
    console.log(enemyNode.getComponent(EnemyPlane).hp)
  }

  //   initEnemyPlane(enemyComp: EnemyPlane) {
  //     const sprite = enemyComp.getComponentInChildren(Sprite)
  //     sprite.spriteFrame = enemyComp.initSprite
  //   }

  generateRandomPos(enemy: Node) {
    const width = enemy.getComponent(UITransform).width
    const height = enemy.getComponent(UITransform).height

    // const width = enemy.getComponent(EnemyPlane).initSprite.width
    // const height = enemy.getComponent(EnemyPlane).initSprite.height
    const range = Constant.canvasInfo.width / 2 - width
    const x = randomRangeInt(-range, range)
    const y = Constant.canvasInfo.height / 2 + height
    return v2(x, y)
  }

  update(deltaTime: number) {}
}
