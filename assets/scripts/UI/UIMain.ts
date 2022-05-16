import { _decorator, Component, Node, Input, EventTouch, input, Game } from "cc"
import { GameManager } from "../framework/GameManager"
const { ccclass, property } = _decorator

@ccclass("UIMain")
export class UIMain extends Component {
  @property
  public speed = 1
  @property(Node)
  public playerPlane: Node = null
  @property(GameManager)
  public gameManager: GameManager = null
  start() {}

  private _touchStart(event: EventTouch) {
    this.gameManager.isShooting(true)
  }

  private _touchMove(event: EventTouch) {
    const delta = event.getDelta()
    let pos = this.playerPlane.position
    this.playerPlane.setPosition(
      pos.x + this.speed * delta.x,
      pos.y + this.speed * delta.y
    )
  }

  private _touchEnd(event: EventTouch) {
    this.gameManager.isShooting(false)
  }

  update(deltaTime: number) {
    if (this.gameManager.gameState == "playing") {
      this.node.on(Input.EventType.TOUCH_START, this._touchStart, this)
      this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
      this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this)
    } else {
      this.node.off(Input.EventType.TOUCH_START, this._touchStart, this)
      this.node.off(Input.EventType.TOUCH_MOVE, this._touchMove, this)
      this.node.off(Input.EventType.TOUCH_END, this._touchEnd, this)
    }
  }
}
