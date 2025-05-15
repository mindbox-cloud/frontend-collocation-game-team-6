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
    field.style.gridTemplateRows = `repeat(${size}, minmax(15px, 1fr))`
    field.style.gridTemplateColumns = `repeat(${size}, minmax(15px, 1fr))`

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const cell = document.createElement('div', {})

            cell.id = `${x}:${y}`
            cell.className = `cell radiation-symbol`
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

    paintCell()
})


let selectedCells = 0

const paintCell = () => {
    if (selectedCells >= config.size *config.size) {
        return;
    }

    const randomX = Math.floor(Math.random() * config.size);
    const randomY = Math.floor(Math.random() * config.size);

    const id = `${randomX}:${randomY}`

    const targetCell = document.getElementById(id);

    if (!targetCell) {
        return
    }

    if (targetCell.classList.contains('selected')) {
        return paintCell()
    }

    targetCell.className = 'selected';
    selectedCells += 1

    setTimeout(() => {
        paintCell()
    }, config.tick)
}
