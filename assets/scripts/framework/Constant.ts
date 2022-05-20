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
    width: 752,
    height: 1334
  }

  // 游戏分数决定等级
  public static gameStage = {
    level_1: 100,
    level_2: 250,
    level_3: 500,
    level_4: 1000
  }
}
