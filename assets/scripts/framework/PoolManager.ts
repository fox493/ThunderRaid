import { _decorator, Component, Node, NodePool, Prefab, instantiate, Pool } from "cc"
const { ccclass, property } = _decorator

interface IDictPool {
  [name: string]: NodePool
}
interface IDictPrefab {
  [name: string]: Prefab
}
@ccclass("PoolManager")
export class PoolManager {
  private _dictPool: IDictPool = {}
  private _dictPrefab: IDictPrefab = {}
  private static _instance: PoolManager = null
  public static instance() {
    if (!this._instance) this._instance = new PoolManager()
    return this._instance
  }

  /**
   * @param prefab 要取出的节点的预制
   * @param parent 该节点要挂载的父节点
   */
  public getNode(prefab: Prefab, parent: Node) {
    let name = prefab.data.name
    let node: Node = null
    this._dictPrefab[name] = prefab
    const pool = this._dictPool[name]
    if (pool) {
      if (pool.size() > 0) {
        console.log(
          `${name}池中取出新的节点，节点池容量为：${PoolManager._instance._dictPool[name].size()}`
        )

        node = pool.get()
      } else {
        node = instantiate(prefab)
        console.log("实例化了节点，消耗性能")
      }
    } else {
      this._dictPool[name] = new NodePool()
      node = instantiate(prefab)
      console.log("实例化了节点，消耗性能")
    }

    node.parent = parent
    node.active = true
    return node
  }

  public putNode(node: Node) {
    let name = node.name
    node.parent = null
    if (!this._dictPool[name]) this._dictPool[name] = new NodePool()
    this._dictPool[name].put(node)
    console.log(
      `${name}池中放入新的节点，节点池容量为：${PoolManager._instance._dictPool[name].size()}`
    )
  }

  start() {}

  update(deltaTime: number) {}
}
