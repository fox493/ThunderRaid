export class Constant {
  public static collisionType = {
    PLANE_PLAYER: 1 << 1,
    ENEMY_PLANE: 1 << 2,
    BULLET: 1 << 3,
    AIRDROP: 1 << 4
  }
  public static airdropType = {
    DOUBLE_BULLET: 1,
    BOMB: 2
  }
  public static gameState = {
    start: 'start',
  }
  public static canvasInfo  = {
    width: 640,
    height: 1136
  }

  // 游戏分数决定等级
  public static gameStage = {
    level_1: 200,
    level_2: 500,
    level_3: 1000,
    level_4: 2000
  }
}
