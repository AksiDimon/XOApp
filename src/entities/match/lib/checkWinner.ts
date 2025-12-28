import type { Mark, CellKey } from '../types';
import { cellKey } from './keys';

type BoardState = Record<CellKey, Mark>;

function getMark(board: BoardState, x: number, y: number): Mark | undefined {
  return board[cellKey(x, y)];
}

// Возвращает массив ключей подряд идущих клеток с mark (включая центр),
// если их 5+ в одной линии. Иначе null.
export function checkWinner(
  board: BoardState,
  x: number,
  y: number,
  mark: Mark
): CellKey[] | null {
  const directions: Array<[number, number]> = [
    [1, 0], // горизонталь
    [0, 1], // вертикаль
    [1, 1], // диагональ \
    [1, -1], // диагональ /
  ];

  for (const [dx, dy] of directions) {
    const line: { x: number; y: number }[] = [];

    // в минус-сторону
    let cx = x - dx;
    let cy = y - dy;
    while (getMark(board, cx, cy) === mark) {
      line.push({ x: cx, y: cy });
      cx -= dx;
      cy -= dy;
    }
    line.reverse();

    // центр
    line.push({ x, y });

    // в плюс-сторону
    cx = x + dx;
    cy = y + dy;
    while (getMark(board, cx, cy) === mark) {
      line.push({ x: cx, y: cy });
      cx += dx;
      cy += dy;
    }

    if (line.length >= 5) {
      return line.map((p) => cellKey(p.x, p.y));
    }
  }

  return null;
}
