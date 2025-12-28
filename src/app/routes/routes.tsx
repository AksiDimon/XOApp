import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../../pages/login/ui/LoginPage';
import { GamePage } from '../../pages/game/ui/GamePage'; //src/pages/game/ui/GamePage.tsx
import { HistoryPage } from '../../pages/history/ui/HistoryPage'; //src/pages/history/ui/HistoryPage.tsx
import { MatchPage } from '../../pages/match/ui/MatchPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/game', element: <GamePage /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '/history/:id', element: <MatchPage /> },
]);
