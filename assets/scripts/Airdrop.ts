import {
  _decorator,
  Component,
  Node,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
} from "cc"
import { Constant } from "./framework/Constant"
import { GameManager } from "./framework/GameManager"
const { ccclass, property } = _decorator

@ccclass("Airdrop")
export class Airdrop extends Component {
  private _dropSpeed = 0.3
  private _gameManager: GameManager = null
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
    if (other.group == Constant.collisionType.PLANE_PLAYER) {
      const name = this.node.name
      if(name == 'airdrop_double_bullet') {
        this._gameManager.changeBullet()
      } else if(name == 'airdrop_bomb') {
          this._gameManager.bomb()
      }
      this.node.destroy()
    }
  }

  init(gameManager: GameManager, speed: number) {
    this._gameManager = gameManager
    this._dropSpeed = speed
  }

  update(deltaTime: number) {
    const pos = this.node.position
    this.node.setPosition(pos.x, pos.y - this._dropSpeed)
  }
}
