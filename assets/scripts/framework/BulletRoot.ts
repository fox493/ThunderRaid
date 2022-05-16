import { _decorator, Component, Node, Prefab } from "cc"
const { ccclass, property } = _decorator

export class Bullet {
  @property
  public name = ""
  @property
  public fireSpeed = 0
  @property
  public prefab: Prefab = null
}

@ccclass("BulletRoot")
export class BulletRoot extends Component {
  @property({ type: [Bullet] })
  public bulletGroup: Bullet[] = []

  private _isStop = false

  update(deltaTime: number) {}
}
