import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../shared/lib/reduxHooks';
import { matchActions } from '../../../../entities/match/model/matchSlice';
import { Button } from '../../../../shared/ui/Button/Button';
import { Input } from '../../../../shared/ui/Input/Input';
import { Card } from '../../../../shared/ui/Card/Card';

function sanitizeName(v: string) {
  return v.trim().slice(0, 24);
}

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [xName, setXName] = useState('');
  const [oName, setOName] = useState('');

  const canStart = useMemo(() => {
    return sanitizeName(xName).length > 0 && sanitizeName(oName).length > 0;
  }, [xName, oName]);

  function onStart() {
    if (!canStart) return;

    dispatch(
      matchActions.setPlayers({
        x: sanitizeName(xName),
        o: sanitizeName(oName),
      })
    );

    navigate('/game');
  }

  return (
    <Card className="p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-cyan-500/15 px-3 py-1 text-[19px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
          XO App
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 via-white/10 to-transparent" />
      </div>

      <h1 className="mt-5 text-2xl font-semibold text-white">
        Введите никнеймы
      </h1>
      {/* <p className="mt-2 text-sm text-slate-300">
        Введите никнеймы — мы запустим игровую сессию с вашим стилем.
      </p> */}

      <div className="mt-6 space-y-4">
        <label className="block">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-slate-400">
            <span>Игрок X</span>
            <span className="text-cyan-200/80">Атакующий</span>
          </div>
          <Input
            className="mt-2"
            value={xName}
            onChange={(e) => setXName(e.target.value)}
            placeholder="Например: Alice"
          />
        </label>

        <label className="block">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-slate-400">
            <span>Игрок O</span>
            <span className="text-cyan-200/80">Контроль</span>
          </div>
          <Input
            className="mt-2"
            value={oName}
            onChange={(e) => setOName(e.target.value)}
            placeholder="Например: Bob"
          />
        </label>

        <Button
          type="button"
          variant="primary"
          disabled={!canStart}
          onClick={onStart}
          className="w-full"
        >
          Start game
        </Button>
      </div>
    </Card>
  );
}
