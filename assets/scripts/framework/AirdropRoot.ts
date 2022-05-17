import {
  _decorator,
  Component,
  Node,
  Prefab,
  UITransform,
  randomRangeInt,
  v2,
} from "cc"
import { AirdropBase } from "../props/AirdropBase"
import { Constant } from "./Constant"
import { PoolManager } from "./PoolManager"
const { ccclass, property } = _decorator

@ccclass("Airdrop")
export class Airdrop {
  @property
  public name = ""
  @property
  public genTime = 0
  @property(Prefab)
  public prefab: Prefab = null
}

@ccclass("AirdropRoot")
export class AirdropRoot extends Component {
  @property({ type: [Airdrop] })
  public airdropGroup: Airdrop[] = []

  public isStop = false

  startAction() {
    for (let i = 0; i < this.airdropGroup.length; i++) {
      const genTime = this.airdropGroup[i].genTime
      const fName = "callback_" + i
      this[fName] = function (e: number) {
        this.generateNewAirdrop(this.airdropGroup[e])
      }.bind(this, i)
      this.schedule(this[fName], genTime)
    }
  }

  // 暂停事件
  pauseAction() {
    this.isStop = true
  }
  // 恢复事件
  resumeAction() {
    this.isStop = false
  }
  overAction() {
    this.node.removeAllChildren()
    for (let i = 0; i < this.airdropGroup.length; i++) {
      const fName = "callback_" + i
      this[fName] = function (e: number) {
        this.generateNewAirdrop(this.airdropGroup[e])
      }.bind(this, i)
      this.unschedule(this[fName])
    }
  }
  generateNewAirdrop(airdrop: Airdrop) {
    if (this.isStop) return
    if (randomRangeInt(0, 1)) return
    const airdropNode = PoolManager.instance().getNode(
      airdrop.prefab,
      this.node
    )
    const randPos = this.generateRandomPos(airdropNode)
    airdropNode.setPosition(randPos.x, randPos.y)
    airdropNode.getComponent(AirdropBase).init()
  }

  generateRandomPos(airdrop: Node) {
    const width = airdrop.getComponent(UITransform).width
    const height = airdrop.getComponent(UITransform).height
    const range = Constant.canvasInfo.width / 2 - width
    const x = randomRangeInt(-range, range)
    const y = Constant.canvasInfo.height / 2 + height
    return v2(x, y)
  }
}
