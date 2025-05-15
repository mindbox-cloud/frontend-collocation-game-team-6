import { Agent, AgentType } from "./agent/Agent.ts";
import { getPath } from "./utils/getPath.ts";
import { gameConfig } from "./config.ts";
import { renderField } from "./field.ts";

const humansArr = new Array(gameConfig.humans).fill(null).map((el, i, arr) => {
    return new Agent(`human_${i}`, AgentType.HUMAN, 10, [1, 1], 2, 1);
});
const zombieArr = new Array(gameConfig.zombies).fill(null).map((el, i, arr) => {
    return new Agent(`zombie_${i}`, AgentType.HUMAN, 10, [1, 1], 2, 1);
});

const agents = [...humansArr, ...zombieArr];

let step = 0;

const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomizePositions = () => {
    const fieldSize = gameConfig.size;
    const occupiedPositions: Array<string> = [];

    const generatePosition = (): [number, number] => {
        let x, y;
        let positionKey;
        let attempts = 0;

        do {
            x = fieldSize && getRandomInt(0, fieldSize - 1);
            y = fieldSize && getRandomInt(0, fieldSize - 1);
            positionKey = `${x},${y}`;
            attempts++;

            if (attempts > 50) break;
        } while (occupiedPositions.includes(positionKey));

        occupiedPositions.push(positionKey);
        return [x, y] as [number, number];
    };

    humansArr.forEach((human) => {
        human.position = generatePosition();
    });

    zombieArr.forEach((zombie) => {
        zombie.type = AgentType.ZOMBIE;
        zombie.position = generatePosition();
    });
};

const nextStep = () => {
    agents.forEach((agent, index, arr) => {
        const { id, position } = agent;

        const filteredAgents = arr.filter((el) => el.id !== id);

        const suggestedPath = getPath(position, filteredAgents);

        console.log(suggestedPath);
        agent.move(suggestedPath, () => {
            renderField();
        });
    });

    step += 1;
};

const mapAgentsToPositions = () => {};
