import type { Position } from "../types.ts";
import type { Agent }  from "../agent/Agent.ts";
import { gameConfig } from "../config.ts";

export const getPath = (
    position: Position,
    agents: Agent[],
    direction: 'from' | 'to' = 'to'
): Position[] => {
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
        const fieldSize = gameConfig.size || 10; // Используем 10 как значение по умолчанию, если размер не задан
        target = [
            Math.max(0, Math.min(fieldSize - 1, Math.round(position[0] * 2 - cx))),
            Math.max(0, Math.min(fieldSize - 1, Math.round(position[1] * 2 - cy)))
        ];
    }

    // Получаем размер поля из конфигурации
    const fieldSize = gameConfig.size || 10;

    // 4. Строим путь по алгоритму Брезенхэма с учётом границ поля
    const path: Position[] = [];
    let [x0, y0] = position;
    const [x1, y1] = target;
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    // Вспомогательная функция для проверки, находится ли точка внутри границ поля
    const isInBounds = (x: number, y: number): boolean => {
        return x >= 0 && x < fieldSize && y >= 0 && y < fieldSize;
    };

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

        x0 = nextX;
        y0 = nextY;
    }

    return path;
};