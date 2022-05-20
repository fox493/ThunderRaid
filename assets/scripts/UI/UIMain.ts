import { _decorator, Component, Node, Input, EventTouch, input, Game } from "cc"
import { Constant } from "../framework/Constant"
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
    let movedX = pos.x + this.speed * delta.x
    let movedY = pos.y + this.speed * delta.y
    let maxX = Constant.canvasInfo.width / 2 - 90
    let maxY = Constant.canvasInfo.height / 2 - 111
    if (movedX <= -maxX || movedX >= maxX) movedX = pos.x
    if (movedY <= -maxY || movedY >= maxY) movedY = pos.y
    else this.playerPlane.setPosition(movedX, movedY)
  }

  update(deltaTime: number) {
    if (this.gameManager.gameState == "playing") {
      this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
    } else {
      this.node.off(Input.EventType.TOUCH_MOVE, this._touchMove, this)
    }
  }
}
