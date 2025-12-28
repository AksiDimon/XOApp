import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MatchRecord } from '../types';
import { loadJSON, saveJSON } from '../../../shared/lib/storage/storage';
import { STORAGE_KEYS } from '../../../shared/config/storageKeys';

type HistoryState = {
  items: MatchRecord[];
};

const initialState: HistoryState = {
  items: loadJSON<MatchRecord[]>(STORAGE_KEYS.HISTORY, []),
};

function persist(items: MatchRecord[]) {
  saveJSON(STORAGE_KEYS.HISTORY, items);
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addMatch(state, action: PayloadAction<MatchRecord>) {
      state.items.unshift(action.payload);
      persist(state.items);
    },
    clear(state) {
      state.items = [];
      persist(state.items);
    },
  },
});

export const historyActions = historySlice.actions;
export const historyReducer = historySlice.reducer;
