import {
  _decorator,
  Component,
  Node,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Animation,
  SpriteFrame,
  AudioSource,
  Sprite,
} from "cc"
import { Constant } from "../framework/Constant"
import { EnemyRoot } from "../framework/EnemyRoot"
import { PoolManager } from "../framework/PoolManager"
const { ccclass, property } = _decorator

const OUT_RANGE = -655
@ccclass("EnemyPlane")
export class EnemyPlane extends Component {
  @property
  public speed = 0
  @property
  public initHp = 0
  @property(SpriteFrame)
  public initSprite: SpriteFrame = null


  public enemyRoot: EnemyRoot = null
  public hp = 0
  onEnable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
    this.init()
  }

  onDisable() {
    const collider = this.getComponent(Collider2D)
    collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this)
  }
  onLoad() {
    this.enemyRoot = this.node.parent.getComponent(EnemyRoot)
  }
  private _onBeginContact(
    self: Collider2D,
    other: Collider2D,
    contact: IPhysics2DContact
  ) {
    if (other.group == Constant.collisionType.BULLET) {
      const anim = this.getComponent(Animation)
      const audio = this.getComponent(AudioSource)
      console.log(this.hp)
      if (this.hp > 0) {
        this.hp--
      } else return
      if (anim.clips[1]) anim.play(anim.clips[1].name)
      if (this.hp <= 0) {
        anim.play(anim.clips[0].name)
        anim.on("finished", this._onFinished, this)
        audio.playOneShot(audio.clip)
      }
    }
  }

  init() {
    let sprite = this.getComponentInChildren(Sprite)
    sprite.spriteFrame = this.initSprite
    this.hp = this.initHp
  }

  private _onFinished() {
    if (this.hp <= 0) {
      this.init()
      PoolManager.instance().putNode(this.node)
    }
  }

  update(deltaTime: number) {
    if(this.enemyRoot.isStop) return
    const pos = this.node.position
    const movePos = pos.y - this.speed
    this.node.setPosition(pos.x, movePos)
    if (movePos < OUT_RANGE) {
      PoolManager.instance().putNode(this.node)
    }
  }
}
