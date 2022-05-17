import {
  _decorator,
  Component,
  Node,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
} from "cc"
import { BulletRoot } from "../framework/BulletRoot"
import { Constant } from "../framework/Constant"
import { PoolManager } from "../framework/PoolManager"
const { ccclass, property } = _decorator

const OUT_OF_RANGE = 1140
@ccclass("PlayerBullet")
export class PlayerBullet extends Component {
  @property
  public bulletSpeed = 0

  public bulletRoot: BulletRoot = null

  onEnable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  onDisable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }

  onLoad() {
    this.bulletRoot =  this.node.parent.getComponent(BulletRoot)
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
    if(this.bulletRoot.isStop) return
    const pos = this.node.position
    const movedPos = pos.y + this.bulletSpeed
    this.node.setPosition(pos.x, movedPos)
    if (movedPos > OUT_OF_RANGE) {
      // this.node.destroy()
      PoolManager.instance().putNode(this.node)
    }
  }
}
