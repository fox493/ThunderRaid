import {
  _decorator,
  Component,
  Node,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
} from "cc"
import { Constant } from "../framework/Constant"
import { PoolManager } from "../framework/PoolManager"
const { ccclass, property } = _decorator

const OUT_OF_RANGE = 1140
@ccclass("Bullet")
export class Bullet extends Component {
  @property
  public bulletSpeed = 0

  onEnable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  onDisable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }
  private _onBeginContact(
    self: Collider2D,
    other: Collider2D,
    contact: IPhysics2DContact
  ) {
    if (other.group == Constant.collisionType.ENEMY_PLANE) {
      PoolManager.instance().putNode(this.node)
    }
  }

  update(deltaTime: number) {
    const pos = this.node.position
    const movedPos = pos.y + this.bulletSpeed
    this.node.setPosition(pos.x, movedPos)
    if (movedPos > OUT_OF_RANGE) {
      // this.node.destroy()
      PoolManager.instance().putNode(this.node)
    }
  }
}
