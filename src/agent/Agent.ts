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

  public move(coordinates: Array<[number, number]>, onMove: () => void): void {
    if (coordinates.length === 0) {
      this.increaseStamina();
      return;
    }

    if (coordinates.length > 1 && this.stamina > 0) {
      coordinates.slice(0, 2).forEach((coordinate) => {
        this.updatePosition(coordinate, onMove);
      });
      this.decreaseStamina();
    } else {
      this.updatePosition(coordinates[0], onMove);
    }
  }

  private updatePosition(
    coordinate: [number, number],
    onMove: () => void
  ): void {
    this.position = coordinate;
    onMove();
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
