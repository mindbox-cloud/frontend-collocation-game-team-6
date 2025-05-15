import {AgentType} from "./agent/Agent.ts";
import type {Position} from "./types.ts";
import {gameConfig} from "./config.ts";



const renderField = () => {
    const size = gameConfig.size || 10;
    if (size < 1 || size > 100) {
        return alert('Ты лох');
    }

    const field = document.getElementById('field');

    if (!field) {
        throw new Error()
    }

    field.innerHTML = ''
    field.style.gridTemplateRows = `repeat(${size}, minmax(30px, 1fr))`
    field.style.gridTemplateColumns = `repeat(${size}, minmax(30px, 1fr))`

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const cell = document.createElement('div', {})

            cell.id = `${x}:${y}`
            cell.className = `cell`
            field.appendChild(cell);
        }
    }
}

renderField()

const button = document.getElementById('ok-button')

button?.addEventListener('click', (e) => {
    console.log('OK')
})

const paintCell = (x: number, y: number, type: AgentType) => {
    const id = `${x}:${y}`

    const targetCell = document.getElementById(id);

    if (!targetCell) {
        return
    }

    if (targetCell.classList.contains('occupied')) {
        return
    }

    targetCell.className = 'occupied';
    targetCell.className = type === AgentType.HUMAN ? 'cell human' : 'cell zombie'
}


export const renderAgents = (positions: { type: AgentType, position: Position }[]) => {
    const field = document.getElementById('field');
    field && (field.innerHTML = '')
    renderField()

    positions.forEach(({type, position}) => {
        paintCell(position[0], position[1], type)
    })

}