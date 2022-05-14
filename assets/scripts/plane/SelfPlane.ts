import { _decorator, Component, Node, Collider, ITriggerEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SelfPlane')
export class SelfPlane extends Component {

    start() {
        const collider = this.getComponent(Collider)
        collider.on('onTriggerEnter', this._onTiggerEnter, this)
    }

    private _onTiggerEnter(event: ITriggerEvent) {
        console.log('collide!')
        const collisionGroup = event.otherCollider.getGroup()
        console.log(collisionGroup)
    }

    update(deltaTime: number) {
        
    }
}

