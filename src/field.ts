import {AgentType} from "./agent/Agent.ts";
import type {Position} from "./types.ts";

const config = {
    tick: 1000,
    size: 10
}

const renderField = () => {
    const {size} = config
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
            field.appendChild(cell);
        }
    }
}

renderField()

const button = document.getElementById('ok-button')

button?.addEventListener('click', (e) => {
    e.preventDefault()

    const sizeInput = document.getElementById('size') as HTMLInputElement
    const tickInput = document.getElementById('tick') as HTMLInputElement

    const newSize = parseInt(sizeInput?.value)
    config.tick = parseInt(tickInput?.value)

    if (newSize !== config.size) {
        config.size = newSize
        renderField()
    }
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
    targetCell.className = type === AgentType.HUMAN ? 'human' : 'zombie'
}


export const renderAgents = (positions: { type: AgentType, position: Position }[]) => {
console.log(123,positions)
    positions.forEach(({type, position}) => {
        paintCell(position[0], position[1], type)
    })

}