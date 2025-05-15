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



randomizePositions()

const agents = [...humansArr, ...zombieArr]


let step = 0

// Добавим функцию для проверки наличия зомби вокруг человека
const isZombieNearby = (humanPosition: Position, zombieAgents: Agent[]): boolean => {
    const [humanX, humanY] = humanPosition;

    return zombieAgents.some(zombie => {
        const [zombieX, zombieY] = zombie.position;

        // Проверяем, находится ли зомби на расстоянии 1 клетки от человека
        const xDistance = Math.abs(humanX - zombieX);
        const yDistance = Math.abs(humanY - zombieY);

        // Зомби считается рядом, если он на расстоянии не более 1 клетки по каждой оси
        return xDistance <= 1 && yDistance <= 1;
    });
};

const nextStep = async () => {
    // Проверяем, остались ли еще люди
    const humansRemaining = agents.some(agent => agent.type === AgentType.HUMAN);

    // Если людей не осталось, завершаем игру
    if (!humansRemaining) {
        console.log("Игра окончена! Все люди превратились в зомби.");
        return; // Прекращаем рекурсивные вызовы
    }

    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        const {id, position, type} = agent;

        // Добавляем проверку наличия зомби вокруг человека в начале каждой итерации
        if (type === AgentType.HUMAN) {
            const zombies = agents.filter(a => a.type === AgentType.ZOMBIE && a.id !== id);
            const hasZombieNearby = isZombieNearby(position, zombies);

            if (hasZombieNearby) {
                agent.mutate();
                // Проверяем после мутации, остались ли еще люди
                const anyHumansLeft = agents.some(a => a.type === AgentType.HUMAN);
                if (!anyHumansLeft) {
                    await sleep(100); // Даем время на рендеринг последних изменений
                    renderAgents(mapAgentsToPositions(agents));
                    alert("Игра окончена! Все люди превратились в зомби.");
                    return; // Прекращаем выполнение если люди закончились
                }
            }
        }

        const suggestedPath = getPath(position, agents, type === AgentType.HUMAN ? 'from' : 'to');

        await agent.move(suggestedPath, async () => {
            await sleep(100);
            renderAgents(mapAgentsToPositions(agents));
        });
    }

    step += 1;
    nextStep();
};
//
// const nextStep = async () => {
//     for (let i = 0; i < agents.length; i++) {
//
//         const agent = agents[i];
//         const { position, type} = agent;
//
//         const suggestedPath = getPath(position, agents, type === AgentType.HUMAN ? 'from' : 'to' );
//
//         await agent.move(suggestedPath, async () => {
//             await sleep(100);
//             renderAgents(mapAgentsToPositions(agents));
//         });
//     }
//
//     step += 1
//     nextStep()
// }


const mapAgentsToPositions = (agents: Agent[]): { type: AgentType, position: Position }[] => {
    return agents.map(agent => {
        return {
            type: agent.type,
            position: agent.position
        }
    })
}


nextStep()