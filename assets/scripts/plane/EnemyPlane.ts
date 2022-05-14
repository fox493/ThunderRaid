import { _decorator, Component, Node } from "cc"
const { ccclass, property } = _decorator

const OUT_RANGE = -655
@ccclass("EnemyPlane")
export class EnemyPlane extends Component {
  @property
  public speed = 0
  start() {}

  update(deltaTime: number) {
    const pos = this.node.position
    const movePos = pos.y - this.speed
    this.node.setPosition(pos.x, movePos)
    if(movePos<OUT_RANGE) {
        this.node.destroy()
    }
  }
}
