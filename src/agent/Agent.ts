export enum AgentType {
  HUMAN = "HUMAN",
  ZOMBIE = "ZOMBIE",
}

export class Agent {
  constructor(
    public id: number,
    public type: AgentType,
    public radius: number,
    public position: [number, number],
    private maxStamina: number,
    private stamina: number
  ) {}

  move(coordinates: Array<[number, number]>, onMove: () => void): void {}

  increaseStamina(): void {}

  decreaseStamina(): void {}

  mutate(): void {
    if (this.type === AgentType.ZOMBIE) return;

    this.type = AgentType.ZOMBIE;
    this.stamina = 0;
    this.maxStamina = 0;
  }
}
