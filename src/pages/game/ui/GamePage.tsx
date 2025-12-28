import { Link, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/reduxHooks';
import { Board } from '../../../widgets/board/ui/Board';
import { historyActions } from '../../../entities/history/model/historySlice';
import {
  selectMoves,
  selectStartedAt,
} from '../../../entities/match/model/selectors';

import {
  selectPlayers,
  selectTurn,
  selectWinner,
} from '../../../entities/match/model/selectors';
import { matchActions } from '../../../entities/match/model/matchSlice';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';
import { WinnerModal } from '../../../widgets/winnerModal/ui/WinnerModal';
import {
  selectIsResultOpen,
  selectIsSaved,
} from '../../../entities/match/model/selectors';

export function GamePage() {
  const dispatch = useAppDispatch();
  const players = useAppSelector(selectPlayers);
  const turn = useAppSelector(selectTurn);
  const winner = useAppSelector(selectWinner);
  const startedAt = useAppSelector(selectStartedAt);
  const moves = useAppSelector(selectMoves);
  const isResultOpen = useAppSelector(selectIsResultOpen);
  const isSaved = useAppSelector(selectIsSaved);

  function saveToHistory() {
    if (!players || !startedAt || !winner) return;
    if (isSaved) return;

    const id = crypto.randomUUID();
    dispatch(
      historyActions.addMatch({
        id,
        players,
        startedAt,
        finishedAt: new Date().toISOString(),
        winner,
        moves,
      })
    );

    dispatch(matchActions.markSaved());
  }

  if (!players) {
    return <Navigate to="/login" replace />;
  }

  const currentName = turn === 'X' ? players.x : players.o;
  const winnerName =
    winner === 'X' ? players.x : winner === 'O' ? players.o : null;
  return (
    <div className="min-h-dvh px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Live match
            </div>
            <h1 className="text-2xl font-semibold text-white">Game</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:text-white"
              to="/history"
            >
              History
            </Link>
            {winner ? (
              <Button onClick={saveToHistory} type="button" variant="secondary">
                Save to history
              </Button>
            ) : null}
            <Button
              onClick={() => dispatch(matchActions.restart())}
              variant="primary"
            >
              Restart
            </Button>
          </div>
        </div>

        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm text-slate-300">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Players
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                X: {players.x} · O: {players.o}
              </div>
            </div>

            <div className="text-sm text-slate-300">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Turn
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {winner
                  ? `Winner: ${winnerName} (${winner})`
                  : `${currentName} (${turn})`}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Board />
          </div>
        </Card>
      </div>
      <WinnerModal
        open={Boolean(winner) && isResultOpen}
        winnerLabel={winner ? `${winnerName} (${winner})` : ''}
        isSaved={isSaved}
        onClose={() => dispatch(matchActions.closeResult())}
        onRestart={() => dispatch(matchActions.restart())}
        onSave={saveToHistory}
      />
    </div>
  );
}
