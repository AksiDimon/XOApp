import { Link } from 'react-router-dom';
import { LoginForm } from '../../../features/auth/login/ui/LoginForm';

export function LoginPage() {
  return (
    <div className="relative  min-h-dvh overflow-hidden px-4 py-6 text-slate-100 sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-16 h-40 w-40 rounded-full bg-cyan-500/25 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-indigo-500/25 blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-xl items-center mt-10 lg:mt-30">
        <div className="space-y-3">
          <LoginForm />
          <div className="text-center text-sm text-slate-300">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-cyan-200 transition hover:border-cyan-400/50 hover:text-white"
              to="/history"
            >
              Посмотреть историю
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
