import { _decorator, Component, Node } from "cc"
const { ccclass, property } = _decorator

@ccclass("movingSceneBg")
export class movingSceneBg extends Component {
  @property(Node)
  bg01: Node = null
  @property(Node)
  bg02: Node = null

  // 背景高度
  private _bgHeight = 1130
  // 背景滚动速度
  private _bgSpeed = 200

  onLoad() {
    this.bg02.setPosition(0, this._bgHeight)
  }

  start() {}

  update(deltaTime: number) {
    this._moveBackground(deltaTime)
  }

  private _moveBackground(deltaTime: number) {
    this.bg01.setPosition(0, this.bg01.position.y - this._bgSpeed * deltaTime)
    this.bg02.setPosition(0, this.bg02.position.y - this._bgSpeed * deltaTime)
    if (this.bg02.position.y < -this._bgHeight) {
      this.bg02.setPosition(0, this._bgHeight + this.bg01.position.y)
    } else if (this.bg01.position.y < -this._bgHeight) {
      this.bg01.setPosition(0, this._bgHeight + this.bg02.position.y)
    }
  }
}
