export interface GameConfig {
    size?: number;
    zombies?: number;
    humans?: number;
    zombieVision?: number;
    humanVision?: number;
    movesToWin?: number;
}

export const gameConfig: GameConfig = {
    size: 10,
    zombies: 2,
    humans: 10,
    zombieVision: 3,
    humanVision: 3,
    movesToWin: 50,
};

export function updateConfig(newValues: Partial<GameConfig>): void {
    Object.assign(gameConfig, newValues);
}
