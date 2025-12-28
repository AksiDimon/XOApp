import { combineReducers } from '@reduxjs/toolkit';
import { matchReducer } from '../../entities/match/model/matchSlice';
import { historyReducer } from '../../entities/history/model/historySlice';

export const rootReducer = combineReducers({
  match: matchReducer,
  history: historyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
