import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/reduxHooks';
import { selectHistoryItems } from '../../../entities/history/model/selectors';
import { historyActions } from '../../../entities/history/model/historySlice';
import { HistoryList } from '../../../widgets/historyList/ui/HistoryList';
import { Button } from '../../../shared/ui/Button/Button';

export function HistoryPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectHistoryItems);

  return (
    <div className="min-h-dvh px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Session Archive
            </div>
            <h1 className="text-2xl font-semibold text-white">History</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:text-white"
              to="/login"
            >
              Login
            </Link>
            <Button
              variant="secondary"
              onClick={() => dispatch(historyActions.clear())}
              type="button"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <HistoryList items={items} />
        </div>
      </div>
    </div>
  );
}
