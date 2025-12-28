import { useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/reduxHooks';
import {
  selectBoard,
  selectCamera,
  selectLastMoveKey,
  selectWinner,
} from '../../../entities/match/model/selectors';
import { matchActions } from '../../../entities/match/model/matchSlice';
import { cellKey } from '../../../entities/match/lib/keys';
import { selectWinLineKeys } from '../../../entities/match/model/selectors';

import styles from './board.module.css';

type Props = {
  readonly?: boolean; // на будущее для просмотра матча
};

export function Board({ readonly = false }: Props) {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectBoard);
  const camera = useAppSelector(selectCamera);
  const lastMoveKey = useAppSelector(selectLastMoveKey);
  const winner = useAppSelector(selectWinner);
  const winLineKeys = useAppSelector(selectWinLineKeys);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    pointerId: number;
    dragging: boolean;
    captured: boolean;
  } | null>(null);

  const draggedRef = useRef(false);

  const cellPx = 44; // примерная “ширина клетки” для пересчёта, подойдёт

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    draggedRef.current = false;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: camera.originX,
      originY: camera.originY,
      pointerId: e.pointerId,
      dragging: false,
      captured: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const st = dragRef.current;
    if (!st) return;

    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;

    // начинаем drag только после порога
    if (!st.dragging && Math.abs(dx) + Math.abs(dy) > 6) {
      st.dragging = true;
      draggedRef.current = true;

      // pointer capture включаем только после начала drag
      if (!st.captured) {
        (e.currentTarget as HTMLDivElement).setPointerCapture(st.pointerId);
        st.captured = true;
      }
    }

    if (!st.dragging) return;

    const shiftX = Math.round(-dx / cellPx);
    const shiftY = Math.round(-dy / cellPx);

    dispatch(
      matchActions.setCamera({
        originX: st.originX + shiftX,
        originY: st.originY + shiftY,
      })
    );
  }

  function onPointerUp() {
    dragRef.current = null;

    // сброс на следующий тик, чтобы не мешать клику
    setTimeout(() => {
      draggedRef.current = false;
    }, 0);
  }

  const winSet = useMemo(() => {
    return winLineKeys ? new Set(winLineKeys) : null;
  }, [winLineKeys]);

  const size = camera.size;
  const cells = useMemo(() => {
    const arr: { x: number; y: number; key: string }[] = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const x = camera.originX + col;
        const y = camera.originY + row;
        arr.push({ x, y, key: cellKey(x, y) });
      }
    }
    return arr;
  }, [camera.originX, camera.originY, size]);

  function pan(dx: number, dy: number) {
    dispatch(
      matchActions.setCamera({
        originX: camera.originX + dx,
        originY: camera.originY + dy,
      })
    );
  }

  function onCellClick(x: number, y: number) {
    if (readonly) return;
    if (winner) return;
    if (draggedRef.current) return;
    dispatch(matchActions.makeMove({ x, y }));
  }

  const step = Math.max(1, Math.floor(size / 3)); // удобно для больших перемещений

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-3 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:p-4">
      {/* Camera controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
          View: x[{camera.originX}..{camera.originX + size - 1}] y[
          {camera.originY}..{camera.originY + size - 1}]
        </div>

        <div className="flex items-center gap-2">
          <button
            className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/40 hover:text-white"
            onClick={() => pan(-step, 0)}
            type="button"
            aria-label="Left"
          >
            ←
          </button>
          <button
            className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/40 hover:text-white"
            onClick={() => pan(step, 0)}
            type="button"
            aria-label="Right"
          >
            →
          </button>
          <button
            className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/40 hover:text-white"
            onClick={() => pan(0, -step)}
            type="button"
            aria-label="Up"
          >
            ↑
          </button>
          <button
            className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/40 hover:text-white"
            onClick={() => pan(0, step)}
            type="button"
            aria-label="Down"
          >
            ↓
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/30"
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {cells.map(({ x, y, key }) => {
            const isWin = winSet?.has(key) ?? false;
            const mark = board[key];
            const isLast = key === lastMoveKey;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onCellClick(x, y)}
                className={[
                  'aspect-square border border-white/10 bg-slate-900/70',
                  'flex items-center justify-center text-cyan-100',
                  'select-none',
                  'text-[clamp(11px,2.4vw,22px)] font-semibold leading-none',
                  'transition hover:border-cyan-400/40 hover:bg-slate-800/80 active:scale-[0.99]',
                  winner ? 'cursor-default' : 'cursor-pointer',
                  isWin ? styles.winCell : '',
                ].join(' ')}
              >
                {mark ? (
                  <span className={isLast ? styles.pop : ''}>{mark}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* <div className="mt-2 text-xs text-neutral-500">
        Кликни по клетке — ставится X/O. Стрелками двигаешь “камеру” по
        бесконечной плоскости.
      </div> */}
    </div>
  );
}
