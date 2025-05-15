import type { Position } from "../types.ts";
import type { Agent }  from "../agent/Agent.ts";
import { gameConfig } from "../config.ts";

export const getPath = (
    position: Position,
    agents: Agent[],
    direction: 'from' | 'to' = 'to',
    depth: number = 0,
    maxDepth: number = 5,
    visitedPositions: Set<string> = new Set()
): Position[] => {
    // Ограничение на максимальную глубину рекурсии
    if (depth >= maxDepth) return [];

    // Добавляем текущую позицию в посещенные
    visitedPositions.add(`${position[0]},${position[1]}`);

    // 1. Находим "своего" агента по текущей позиции
    const current = agents.find(a =>
        a.position[0] === position[0] &&
        a.position[1] === position[1]
    );

    if (!current) return [];

    // 2. Собираем позиции всех врагов (тип ≠ наш тип)
    const enemies = agents
        .filter(a => a.type !== current.type)
        .map(a => a.position);
    if (enemies.length === 0) return [];

    // утилита для квадрата эвклидова расстояния
    const sqDist = ([x0, y0]: Position, [x1, y1]: Position) =>
        (x1 - x0) ** 2 + (y1 - y0) ** 2;

    // 3. Выбираем цель
    let target: Position;
    if (direction === 'to') {
        // идём к ближайшему врагу
        target = enemies.reduce((best, p) =>
                sqDist(position, p) < sqDist(position, best) ? p : best
            , enemies[0]);
    } else {
        // убегаем от центроида врагов
        const [sumX, sumY] = enemies.reduce<[number,number]>(([sx, sy], [x, y]) => [sx + x, sy + y], [0, 0]);
        const n = enemies.length;
        const cx = sumX / n, cy = sumY / n;
        // вектор от центроида к нам: (x - cx, y - cy)
        // цель = наша поза + (x - cx, y - cy)  => [2*x - cx, 2*y - cy]

        // Ограничиваем целевую позицию границами поля
        const fieldSize = gameConfig.size || 10;
        target = [
            Math.max(0, Math.min(fieldSize - 1, Math.round(position[0] * 2 - cx))),
            Math.max(0, Math.min(fieldSize - 1, Math.round(position[1] * 2 - cy)))
        ];
    }

    // Получаем размер поля из конфигурации
    const fieldSize = gameConfig.size || 10;

    // Вспомогательная функция для проверки, находится ли точка внутри границ поля
    const isInBounds = (x: number, y: number): boolean => {
        return x >= 0 && x < fieldSize && y >= 0 && y < fieldSize;
    };

    // Функция для проверки, занята ли позиция другим агентом
    const isPositionOccupied = (pos: Position): boolean => {
        return agents.some(agent =>
            agent.position[0] === pos[0] &&
            agent.position[1] === pos[1] &&
            // Проверяем, что это не текущий агент
            !(agent.position[0] === position[0] && agent.position[1] === position[1])
        );
    };

    // Функция для получения возможных соседних клеток (в том числе по диагонали)
    const getNeighbors = (pos: Position): Position[] => {
        const [x, y] = pos;
        const neighbors: Position[] = [];

        // Проверяем все 8 окружающих клеток
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Пропускаем текущую клетку

                const nx = x + dx;
                const ny = y + dy;

                if (isInBounds(nx, ny) &&
                    !isPositionOccupied([nx, ny]) &&
                    !visitedPositions.has(`${nx},${ny}`)) {
                    neighbors.push([nx, ny]);
                }
            }
        }

        return neighbors;
    };

    // 4. Строим путь по алгоритму Брезенхэма с учётом границ поля
    const path: Position[] = [];
    let [x0, y0] = position;
    const [x1, y1] = target;
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let collisionOccurred = false;

    while (true) {
        if (isInBounds(x0, y0)) {
            path.push([x0, y0]);
        }

        if (x0 === x1 && y0 === y1) break;

        const e2 = err * 2;
        let nextX = x0, nextY = y0;

        if (e2 > -dy) {
            err -= dy;
            nextX += sx;
        }
        if (e2 < dx) {
            err += dx;
            nextY += sy;
        }

        // Если следующая позиция выходит за границы, останавливаемся
        if (!isInBounds(nextX, nextY)) break;

        // Проверяем, занята ли следующая позиция другим агентом
        if (isPositionOccupied([nextX, nextY])) {
            collisionOccurred = true;
            break; // Прерываем цикл построения пути
        }

        x0 = nextX;
        y0 = nextY;
    }

    // Если произошла коллизия, ищем обходной путь
    if (collisionOccurred && depth < maxDepth) {
        // Получаем все возможные соседние клетки для текущей позиции
        const neighbors = getNeighbors([x0, y0]);

        if (neighbors.length > 0) {
            // Сортируем соседей по расстоянию до цели (сначала ближайшие)
            neighbors.sort((a, b) => sqDist(a, target) - sqDist(b, target));

            // Пробуем построить путь из каждой соседней клетки
            for (const neighbor of neighbors) {
                // Рекурсивный вызов с новой стартовой позицией
                const alternativePath = getPath(
                    neighbor,
                    agents,
                    direction,
                    depth + 1,
                    maxDepth,
                    new Set(visitedPositions) // Копируем посещенные позиции
                );

                if (alternativePath.length > 0) {
                    // Нашли альтернативный путь, объединяем
                    return path.concat(alternativePath.slice(1)); // Убираем дублирование
                }
            }

            // Если не нашли хороший альтернативный путь, просто делаем любой доступный ход
            // Берем первый свободный сосед и добавляем его как следующий шаг
            return [position, neighbors[0]];
        }
    }

    // Если путь нашли успешно, возвращаем его
    if (path.length > 1) {
        return path;
    }

    // Если не построили никакого пути, просто проверяем, есть ли хоть какие-то свободные клетки вокруг
    const availableNeighbors = getNeighbors(position);
    if (availableNeighbors.length > 0) {
        // Возвращаем первый доступный ход в любом направлении
        return [position, availableNeighbors[0]];
    }

    // Если вообще некуда идти, возвращаем пустой путь
    return path;
};