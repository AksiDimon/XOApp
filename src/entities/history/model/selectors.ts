import type { RootState } from '../../../app/store/rootReducer';

export const selectHistoryItems = (s: RootState) => s.history.items;
export const selectHistoryById = (id: string) => (s: RootState) =>
  s.history.items.find((m) => m.id === id) ?? null;
