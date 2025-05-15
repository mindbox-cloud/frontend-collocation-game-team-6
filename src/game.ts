import {Agent, AgentType} from "./agent/Agent.ts";
import {getPath} from "./utils/getPath.ts";
import {gameConfig} from "./config.ts";
import {renderAgents} from "./field.ts";
import type {Position} from "./types.ts";
import {sleep} from "./utils/common.ts";

const humansArr = new Array(gameConfig.humans).fill(null).map((el, i, arr) => {
    return new Agent(
        `human_${i}`,
        AgentType.HUMAN,
        10,
        [1, 1],
        2,
        1
    )
})

const zombieArr = new Array(gameConfig.zombies).fill(null).map((el, i, arr) => {
    return new Agent(
        `zombie_${i}`,
        AgentType.ZOMBIE,
        10,
        [1, 5],
        2,
        1
    )
})

const agents = [...humansArr, ...zombieArr]


let step = 0


const nextStep = async () => {
    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        const {id, position} = agent;

        const filteredAgents = agents.filter(el => el.id !== id);

        const suggestedPath = getPath(position, filteredAgents);

        console.log(suggestedPath);
        await agent.move(suggestedPath, async () => {
            await sleep(1000);
            renderAgents(mapAgentsToPositions(agents));
        });
    }

    step += 1
    nextStep()
}


const mapAgentsToPositions = (agents: Agent[]): { type: AgentType, position: Position }[] => {
    return agents.map(agent => {
        return {
            type: agent.type,
            position: agent.position
        }
    })
}


nextStep()