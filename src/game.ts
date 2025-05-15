import {Agent, AgentType} from "./agent/Agent.ts";
import {getPath} from "./utils/getPath.ts";
import {gameConfig} from "./config.ts";



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
        AgentType.HUMAN,
        10,
        [1, 1],
        2,
        1
    )
})

const agents = [...humansArr, ...zombieArr]


let step = 0


const nextStep = () => {
    agents.forEach((agent, index, arr) => {
        const {id, position} = agent

        const filteredAgents = arr.filter(el => el.id !== id)

        const suggestedPath = getPath(position, filteredAgents)


        console.log(suggestedPath)
        agent.move(suggestedPath, () => console.log('moved'))

    })






    step += 1
}
