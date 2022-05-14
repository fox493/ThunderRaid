import {
  _decorator,
  Component,
  Node,
  Collider,
  ITriggerEvent,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Sprite,
} from "cc"
import { Constant } from "../framework/Constant"
const { ccclass, property } = _decorator

@ccclass("SelfPlane")
export class SelfPlane extends Component {
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
      console.log("撞击敌机")
    }
  }

  update(deltaTime: number) {}
}
