import type { Mark, Move, Players } from '../match/types';

export type MatchRecord = {
  id: string;
  players: Players;
  startedAt: string;
  finishedAt: string;
  winner: Mark | null;
  moves: Move[];
};
