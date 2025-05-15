import type { Position} from "../types.ts";
import type {Agent} from "../agent/Agent.ts";

export const getPath = (position: Position, agents: Agent[], direction: 'from' | 'to' = 'to' ) => {

    const result: Position[] = [[1,2],[1,3],[1,4]]

    return result
}