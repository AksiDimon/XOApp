import type { RootState } from '../../../app/store/rootReducer';

export const selectMatch = (s: RootState) => s.match;
export const selectPlayers = (s: RootState) => s.match.players;
export const selectTurn = (s: RootState) => s.match.turn;
export const selectWinner = (s: RootState) => s.match.winner;

export const selectBoard = (s: RootState) => s.match.board;
export const selectCamera = (s: RootState) => s.match.camera;
export const selectLastMoveKey = (s: RootState) => s.match.lastMoveKey;

export const selectWinLineKeys = (s: RootState) => s.match.winLineKeys;

export const selectStartedAt = (s: RootState) => s.match.startedAt;
export const selectMoves = (s: RootState) => s.match.moves;

export const selectIsResultOpen = (s: RootState) => s.match.isResultOpen;
export const selectIsSaved = (s: RootState) => s.match.isSaved;
