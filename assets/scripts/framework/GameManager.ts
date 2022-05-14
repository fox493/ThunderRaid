import { _decorator, Component, Node, Prefab, instantiate } from "cc"
import { Bullet } from "../bullet/Bullet"
import { EnemyPlane } from "../plane/EnemyPlane"
const { ccclass, property } = _decorator

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Node)
  public playerPlane: Node = null
  @property({ group: { name: "bullet01", id: "1" }, type: Prefab })
  public bullet01: Prefab = null
  @property({ group: { name: "bullet01", id: "1" } })
  public shootTime = 0.3
  @property({ group: { name: "bullet01", id: "1" } })
  public bulletSpeed = 1
  @property({ group: { name: "enemy01", id: "2" }, type: Prefab })
  public enemyPlane01: Prefab = null
  @property({ group: { name: "enemy01", id: "2" } })
  public enemy01Speed = 0
  @property({ group: { name: "enemy01", id: "2" } })
  public enemy01GenTimeRange = 0
  @property({ group: { name: "root" }, type: Node })
  public bulletRoot: Node = null
  @property({ group: { name: "root" }, type: Node })
  public enemyPlaneRoot: Node = null

  private _currentShootTime = 0
  private _isShooting = false
  private _currentGenEnemyTime = 0
  private _nextEnemy01Time = 0

  //  玩家分数
  private _score = 0

  start() {
    this.generateEnemyPlane01()
  }

  update(deltaTime: number) {
    this._currentShootTime += deltaTime
    this._currentGenEnemyTime += deltaTime
    if (this._isShooting && this._currentShootTime > this.shootTime) {
      this.createPlayerBullet()
      this._currentShootTime = 0
    }
    if (this._currentGenEnemyTime > this._nextEnemy01Time) {
      this.generateEnemyPlane01()
      this._currentGenEnemyTime = 0
    }
  }

  public createPlayerBullet() {
    const bullet = instantiate(this.bullet01)
    bullet.setParent(this.bulletRoot)
    const pos = this.playerPlane.position
    bullet.setPosition(pos.x, pos.y + 80)
    const bulletComp = bullet.getComponent(Bullet)
    bulletComp.bulletSpeed = this.bulletSpeed
  }

  public generateEnemyPlane01() {
    const enemy = instantiate(this.enemyPlane01)
    enemy.setParent(this.enemyPlaneRoot)
    const randPosX = this.generateRandomX(52)
    console.log(randPosX)
    enemy.setPosition(randPosX, 595)
    const enemyComp = enemy.getComponent(EnemyPlane)
    enemyComp.speed = this.enemy01Speed
    this._nextEnemy01Time = this.generateRandomTime(this.enemy01GenTimeRange)
    console.log(`next 01: ${this._nextEnemy01Time}`)
  }

  public generateRandomTime(range: number) {
    return Math.random() * range
  }

  public addScore(score: number) {
    this._score += score
    console.log(this._score)
  }

  // 随机生成x坐标，传入飞机宽度
  public generateRandomX(width: number) {
    const rand = (Math.random() - 0.5) * 2
    const range = 320 - width
    return rand * range
  }

  public isShooting(value: boolean) {
    this._isShooting = value
  }
}
