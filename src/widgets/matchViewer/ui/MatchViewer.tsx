import { useMemo } from 'react';
import type { MatchRecord } from '../../../entities/history/types';
import { cellKey } from '../../../entities/match/lib/keys';

type Mark = 'X' | 'O';

function buildBoard(moves: MatchRecord['moves']) {
  const board: Record<string, Mark> = {};
  for (const mv of moves) {
    board[cellKey(mv.x, mv.y)] = mv.mark;
  }
  return board;
}

export function MatchViewer({ match }: { match: MatchRecord }) {
  const { board, bounds } = useMemo(() => {
    const b = buildBoard(match.moves);

    if (match.moves.length === 0) {
      return {
        board: b,
        bounds: null as null | {
          minX: number;
          maxX: number;
          minY: number;
          maxY: number;
        },
      };
    }

    let minX = match.moves[0].x;
    let maxX = match.moves[0].x;
    let minY = match.moves[0].y;
    let maxY = match.moves[0].y;

    for (const mv of match.moves) {
      if (mv.x < minX) minX = mv.x;
      if (mv.x > maxX) maxX = mv.x;
      if (mv.y < minY) minY = mv.y;
      if (mv.y > maxY) maxY = mv.y;
    }

    const pad = 2;
    return {
      board: b,
      bounds: {
        minX: minX - pad,
        maxX: maxX + pad,
        minY: minY - pad,
        maxY: maxY + pad,
      },
    };
  }, [match.moves]);

  if (!bounds) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300 backdrop-blur-xl">
        Нет ходов
      </div>
    );
  }

  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;

  // ограничим размеры, чтобы не рендерить гигантский DOM (на всякий)
  const cappedW = Math.min(width, 35);
  const cappedH = Math.min(height, 35);

  // центрируем “окно” на bounds, если пришлось капнуть
  const startX = bounds.minX + Math.floor((width - cappedW) / 2);
  const startY = bounds.minY + Math.floor((height - cappedH) / 2);

  const cells: { x: number; y: number; key: string }[] = [];
  for (let row = 0; row < cappedH; row++) {
    for (let col = 0; col < cappedW; col++) {
      const x = startX + col;
      const y = startY + row;
      cells.push({ x, y, key: cellKey(x, y) });
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
        Итоговое поле (окно): x[{startX}..{startX + cappedW - 1}] y[{startY}..
        {startY + cappedH - 1}]
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${cappedW}, minmax(0, 1fr))` }}
        >
          {cells.map((c) => (
            <div
              key={c.key}
              className="flex aspect-square items-center justify-center border border-white/10 text-lg font-semibold text-cyan-100"
            >
              {board[c.key] ?? null}
            </div>
          ))}
        </div>
      </div>

      {width > 35 || height > 35 ? (
        <div className="mt-2 text-xs text-slate-400">
          Матч очень большой — показано ограниченное окно 35×35 вокруг центра.
        </div>
      ) : null}
    </div>
  );
}
