import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './winnerModal.module.css';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';

type Props = {
  open: boolean;
  winnerLabel: string;
  isSaved: boolean;
  onClose: () => void;
  onRestart: () => void;
  onSave: () => void;
};

export function WinnerModal({
  open,
  winnerLabel,
  isSaved,
  onClose,
  onRestart,
  onSave,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={[
          'absolute inset-0 bg-black/60 backdrop-blur-md',
          styles.backdrop,
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute inset-0 flex top-15 justify-center h-[320px] p-4">
        <Card
          className={[
            'w-full max-w-md p-7 shadow-[0_30px_120px_-60px_rgba(34,211,238,0.35)]',
            styles.modal,
          ].join(' ')}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Victory
          </div>
          <div className="mt-3 text-2xl font-semibold text-white">Winner</div>
          <div className="mt-2 text-lg font-medium text-cyan-100">
            {winnerLabel}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button variant="primary" onClick={onRestart}>
              Restart
            </Button>

            <Button variant="secondary" onClick={onSave} disabled={isSaved}>
              {isSaved ? 'Saved' : 'Save to history'}
            </Button>

            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </Card>
      </div>
    </div>,
    document.body
  );
}
