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
  public speed = 0.8
  onEnable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    // this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
  }

  onDisable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  private _touchMove(event: EventTouch) {
    if (this.gameManager.gameState == "pause") return
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
      if (other.name == "airDrop_double_bullet<BoxCollider2D>")
        this.gameManager.changeBulletType()
        else
        this.gameManager.addBomb()
    }
  }

  gameEnd() {
    this.gameManager.gameOver()
  }
}
