export enum AgentType {
  HUMAN = "HUMAN",
  ZOMBIE = "ZOMBIE",
}

export class Agent {
  constructor(
    public id: string,
    public type: AgentType,
    public radius: number,
    public position: [number, number],
    private maxStamina: number,
    private stamina: number
  ) {}

  public async move(
    coordinates: Array<[number, number]>,
    onMove: () => Promise<void>
  ): Promise<void> {
    if (coordinates.length === 0) {
      this.increaseStamina();
      return;
    }

    if (coordinates.length > 0) {
      const steps = coordinates.slice(0, 2);

      for (const step of steps) {
        await this.updatePosition(step, onMove);
      }
      this.decreaseStamina();
    } else {
      await this.updatePosition(coordinates[0], onMove);
    }
  }

  private updatePosition(
    coordinate: [number, number],
    onMove: () => Promise<void>
  ): Promise<void> {
    this.position = coordinate;
    return onMove();
  }

  private increaseStamina(): void {
    if (this.stamina < this.maxStamina) {
      this.stamina += 1;
    }
  }

  private decreaseStamina(): void {
    if (this.stamina > 0) {
      this.stamina -= 1;
    }
  }

  public mutate(): void {
    if (this.type === AgentType.ZOMBIE) return;

    this.type = AgentType.ZOMBIE;
    this.stamina = 0;
    this.maxStamina = 0;
  }
}
