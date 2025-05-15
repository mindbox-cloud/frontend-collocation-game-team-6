export enum AgentType {
  HUMAN = "HUMAN",
  ZOMBIE = "ZOMBIE",
}

export class Agent {
  constructor(
    public id: number,
    public type: AgentType,
    public radius: number,
    public maxStamina: number,
    public stamina: number,
    public position: [number, number]
  ) {}

  move(coordinates: Array<[number, number]>, onMove: () => void): void {}

  updateStamina(): void {}

  mutate(): void {}
}
