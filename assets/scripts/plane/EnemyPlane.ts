import {
  _decorator,
  Component,
  Node,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Animation,
} from "cc"
import { Constant } from "../framework/Constant"
const { ccclass, property } = _decorator

const OUT_RANGE = -655
@ccclass("EnemyPlane")
export class EnemyPlane extends Component {
  @property
  public speed = 0
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
    if (other.group == Constant.collisionType.BULLET) {
      const anim = this.getComponent(Animation)
      anim.play("enemyCrash")
      anim.on("finished", this._onFinished, this)
    }
  }

  private _onFinished() {
      this.node.destroy()
  }

  update(deltaTime: number) {
    const pos = this.node.position
    const movePos = pos.y - this.speed
    this.node.setPosition(pos.x, movePos)
    if (movePos < OUT_RANGE) {
      this.node.destroy()
    }
  }
}
