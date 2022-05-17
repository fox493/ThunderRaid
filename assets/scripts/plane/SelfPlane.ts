import {
  _decorator,
  Component,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Animation,
  Input,
  EventTouch,
} from "cc"
import { Constant } from "../framework/Constant"
import { GameManager } from "../framework/GameManager"
const { ccclass, property } = _decorator

@ccclass("SelfPlane")
export class SelfPlane extends Component {
  @property(GameManager)
  public gameManager: GameManager = null
  public speed = 1
  onEnable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    this.onDrag()
  }

  onDisable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  onDrag() {
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
  }
  offDrag() {
    this.node.off(Input.EventType.TOUCH_MOVE, this._touchMove, this)
  }
  private _touchMove(event: EventTouch) {
    const delta = event.getDelta()
    let pos = this.node.position
    this.node.setPosition(
      pos.x + this.speed * delta.x,
      pos.y + this.speed * delta.y
    )
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
    } else if (other.group == Constant.collisionType.AIRDROP) {
      this.gameManager.changeBulletType()
    }
  }

  gameEnd() {
    this.gameManager.gameOver()
  }

  update(deltaTime: number) {}
}
