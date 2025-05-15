export interface GameConfig {
    size?: number;
    zombies?: number;
    humans?: number;
    zombieVision?: number;
    humanVision?: number;
    movesToWin?: number;
}

export const gameConfig: GameConfig = {};

export function updateConfig(newValues: Partial<GameConfig>): void {
    Object.assign(gameConfig, newValues);
}
