import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MatchState, Players, Mark } from '../types';
import { cellKey } from '../lib/keys';
import { checkWinner } from '../lib/checkWinner';

const initialState: MatchState = {
  status: 'idle',
  players: null,
  startedAt: null,

  board: {},
  moves: [],

  turn: 'X',
  winner: null,

  camera: { originX: -10, originY: -10, size: 21 }, // viewport по умолчанию

  lastMoveKey: null,

  winLineKeys: null,

  isResultOpen: false,
  isSaved: false,
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setPlayers(state, action: PayloadAction<Players>) {
      state.players = action.payload;
      state.status = 'in_progress';

      // старт новой партии
      state.board = {};
      state.moves = [];
      state.turn = 'X';
      state.winner = null;
      state.camera = { originX: -10, originY: -10, size: 21 };
      state.lastMoveKey = null;
      state.startedAt = new Date().toISOString();

      state.winLineKeys = null;
      state.isResultOpen = false;
      state.isSaved = false;
    },

    restart(state) {
      if (!state.players) return;
      state.status = 'in_progress';
      state.board = {};
      state.moves = [];
      state.turn = 'X';
      state.winner = null;
      state.camera = { originX: -10, originY: -10, size: 21 };
      state.lastMoveKey = null;
      state.startedAt = new Date().toISOString();
      state.winLineKeys = null;
      state.isResultOpen = false;
      state.isSaved = false;
    },

    // пока без победы: просто ставим метку в разреженное поле
    makeMove(state, action: PayloadAction<{ x: number; y: number }>) {
      if (state.status !== 'in_progress') return;
      if (!state.players) return;
      if (state.winner) return;

      const { x, y } = action.payload;
      const key = cellKey(x, y);
      if (state.board[key]) return;

      const mark: Mark = state.turn;
      state.board[key] = mark;
      state.moves.push({ x, y, mark, at: new Date().toISOString() });

      state.lastMoveKey = key;

      const winLine = checkWinner(state.board, x, y, mark);
      if (winLine) {
        state.winner = mark;
        state.status = 'finished';
        state.winLineKeys = winLine;
        state.isResultOpen = true;
        return;
      }
      // смена хода
      state.turn = mark === 'X' ? 'O' : 'X';
    },

    setCamera(state, action: PayloadAction<Partial<MatchState['camera']>>) {
      state.camera = { ...state.camera, ...action.payload };
    },

    closeResult(state) {
      state.isResultOpen = false;
    },
    openResult(state) {
      if (state.status === 'finished') state.isResultOpen = true;
    },
    markSaved(state) {
      state.isSaved = true;
    },
  },
});

export const matchActions = matchSlice.actions;
export const matchReducer = matchSlice.reducer;
