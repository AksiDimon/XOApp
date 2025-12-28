import { Link, Navigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../shared/lib/reduxHooks';
import { selectHistoryById } from '../../../entities/history/model/selectors';
import { MatchViewer } from '../../../widgets/matchViewer/ui/MatchViewer';

export function MatchPage() {
  const { id } = useParams();
  const match = useAppSelector(selectHistoryById(id ?? ''));

  if (!id) return <Navigate to="/history" replace />;
  if (!match) {
    return (
      <div className="min-h-dvh px-4 py-6 text-slate-100 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Replay
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Match not found
              </h1>
            </div>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:text-white"
              to="/history"
            >
              Back
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300 backdrop-blur-xl">
            Матч с id <span className="font-mono text-cyan-200">{id}</span> не
            найден
          </div>
        </div>
      </div>
    );
  }

  const winnerText = match.winner
    ? match.winner === 'X'
      ? `${match.players.x} (X)`
      : `${match.players.o} (O)`
    : 'No winner';

  return (
    <div className="min-h-dvh px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Replay
            </div>
            <h1 className="text-2xl font-semibold text-white">Match</h1>
          </div>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:text-white"
            to="/history"
          >
            Back to history
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-200 backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Players
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            {match.players.x} (X) vs {match.players.o} (O)
          </div>
          <div className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
            Winner
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            {winnerText}
          </div>
        </div>

        <div className="mt-2">
          <MatchViewer match={match} />
        </div>
      </div>
    </div>
  );
}
