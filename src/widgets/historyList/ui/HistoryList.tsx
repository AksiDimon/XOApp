import { Link } from 'react-router-dom';
import type { MatchRecord } from '../../../entities/history/types';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function HistoryList({ items }: { items: MatchRecord[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300 backdrop-blur-xl">
        История пуста
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((m) => (
        <Link
          key={m.id}
          to={`/history/${m.id}`}
          className="block rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100 transition hover:-translate-y-[1px] hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-[0_20px_70px_-45px_rgba(59,130,246,0.35)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm uppercase tracking-[0.16em] text-slate-400">
                Match
              </div>
              <div className="mt-1 text-lg font-semibold">
                {m.players.x} (X) vs {m.players.o} (O)
              </div>
              <div className="mt-1 text-sm text-slate-400">
                {formatDate(m.finishedAt)}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-cyan-100">
              {m.winner ? `Winner: ${m.winner}` : 'No winner'}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
