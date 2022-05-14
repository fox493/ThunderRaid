import { _decorator, Component, Node } from "cc"
const { ccclass, property } = _decorator


const OUT_OF_RANGE = 1140
@ccclass("Bullet")
export class Bullet extends Component {
  @property
  public bulletSpeed = 0
  start() {}

  update(deltaTime: number) {
    const pos = this.node.position
    const movedPos = pos.y + this.bulletSpeed
    this.node.setPosition(pos.x, movedPos)
    if(movedPos > OUT_OF_RANGE) {
        this.node.destroy()
    }
  }
}
