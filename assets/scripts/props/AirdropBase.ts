import {
  _decorator,
  Component,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
  randomRangeInt,
} from "cc"
import { AirdropRoot } from "../framework/AirdropRoot"
import { Constant } from "../framework/Constant"
import { PoolManager } from "../framework/PoolManager"
const { ccclass, property } = _decorator

const OUT_RANGE = -Constant.canvasInfo.height / 2
@ccclass("AirdropBase")
export class AirdropBase extends Component {
  @property
  public min_speed = 0
  @property
  public max_speed = 0
  @property
  public type = 0

  public airdropRoot: AirdropRoot = null
  public speed: number = 0

  onLoad() {
    this.airdropRoot = this.node.parent.getComponent(AirdropRoot)
  }

  onEnable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  onDisable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  init() {
    this.speed = randomRangeInt(this.min_speed, this.max_speed)
  }

  private _onBeginContact(
    self: Collider2D,
    other: Collider2D,
    contact: IPhysics2DContact
  ) {
    if (other.group == Constant.collisionType.PLANE_PLAYER) {
      PoolManager.instance().putNode(this.node)
    }
  }

  update(deltaTime: number) {
    if (this.airdropRoot.isStop) return
    const pos = this.node.position
    const movePos = pos.y - this.speed
    this.node.setPosition(pos.x, movePos)
    if (movePos < OUT_RANGE) {
      PoolManager.instance().putNode(this.node)
    }
  }
}
