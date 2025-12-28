import { useEffect, useMemo, useState } from 'react';
import type { MatchRecord } from '../../../entities/history/types';
import { cellKey } from '../../../entities/match/lib/keys';
import { Button } from '../../../shared/ui/Button/Button';

type Mark = 'X' | 'O';

function buildBoard(moves: MatchRecord['moves']) {
  const board: Record<string, Mark> = {};
  for (const mv of moves) {
    board[cellKey(mv.x, mv.y)] = mv.mark;
  }
  return board;
}

export function MatchViewer({ match }: { match: MatchRecord }) {
  const totalMoves = match.moves.length;
  const [cursor, setCursor] = useState(totalMoves);

  useEffect(() => {
    setCursor(match.moves.length);
  }, [match.moves.length, match.id]);

  const visibleMoves = useMemo(
    () => match.moves.slice(0, cursor),
    [match.moves, cursor]
  );

  const { board, bounds } = useMemo(() => {
    const b = buildBoard(visibleMoves);

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
  }, [match.moves, visibleMoves]);

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

  const lastVisible = visibleMoves[visibleMoves.length - 1];
  const lastVisibleKey = lastVisible ? cellKey(lastVisible.x, lastVisible.y) : null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
          Итоговое поле (окно): x[{startX}..{startX + cappedW - 1}] y[
          {startY}..{startY + cappedH - 1}]
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCursor(0)}
            disabled={cursor === 0}
          >
            ⏮ Начало
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCursor((c) => Math.max(0, c - 1))}
            disabled={cursor === 0}
          >
            ← Шаг
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCursor((c) => Math.min(totalMoves, c + 1))}
            disabled={cursor === totalMoves}
          >
            Шаг →
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCursor(totalMoves)}
            disabled={cursor === totalMoves}
          >
            Конец ⏭
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-300">
          Ход: <span className="font-semibold text-white">{cursor}</span> /
          {totalMoves}{' '}
          {lastVisible
            ? `(${lastVisible.mark} · ${lastVisible.x},${lastVisible.y})`
            : '(старт)'}
        </div>

        <div className="flex-1 sm:max-w-xs">
          <input
            type="range"
            min={0}
            max={totalMoves}
            value={cursor}
            onChange={(e) => setCursor(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
      </div>

      <div className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">
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
              className={[
                'flex aspect-square items-center justify-center border border-white/10 text-lg font-semibold text-cyan-100',
                lastVisibleKey === c.key
                  ? 'bg-cyan-500/20 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.4)]'
                  : '',
              ].join(' ')}
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
