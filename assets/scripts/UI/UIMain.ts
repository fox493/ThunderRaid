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
  private _touchMove(event: EventTouch) {
    const delta = event.getDelta()
    let pos = this.playerPlane.position
    this.playerPlane.setPosition(
      pos.x + this.speed * delta.x,
      pos.y + this.speed * delta.y
    )
  }
  update(deltaTime: number) {
    if (this.gameManager.gameState == "playing") {
      this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
    } else {
      this.node.off(Input.EventType.TOUCH_MOVE, this._touchMove, this)
    }
  }
}
