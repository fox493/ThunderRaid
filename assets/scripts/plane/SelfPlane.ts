import {
  _decorator,
  Component,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Animation,
} from "cc"
import { Constant } from "../framework/Constant"
import { GameManager } from "../framework/GameManager"
const { ccclass, property } = _decorator

@ccclass("SelfPlane")
export class SelfPlane extends Component {
  @property(GameManager)
  public gameManager: GameManager = null

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
      const anim = this.getComponent(Animation)
      anim.play()
      anim.on("finished", this.gameEnd, this)
    }
  }

  gameEnd() {
    this.gameManager.gameOver()
  }

  update(deltaTime: number) {}
}
