export type Mark = 'X' | 'O';
export type CellKey = string; // `${x},${y}`

export type Players = {
  x: string;
  o: string;
};

export type Move = {
  x: number;
  y: number;
  mark: Mark;
  at: string; // ISO string
};

export type Camera = {
  originX: number;
  originY: number;
  size: number; // cells per side in viewport (e.g. 21)
};

export type MatchStatus = 'idle' | 'in_progress' | 'finished';

export type MatchState = {
  status: MatchStatus;
  players: Players | null;

  startedAt: string | null;

  // sparse board: only occupied cells
  board: Record<CellKey, Mark>;
  moves: Move[];

  turn: Mark; // чей ход сейчас
  winner: Mark | null;

  camera: Camera;

  lastMoveKey: CellKey | null;

  winLineKeys: CellKey[] | null;

  isResultOpen: boolean; // модалка результата
  isSaved: boolean;
};
