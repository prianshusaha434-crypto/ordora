'use client';

import { useSyncExternalStore } from 'react';
import { ordoraStore, AppState } from './store';

export function useStore(): AppState & typeof ordoraStore {
  const state = useSyncExternalStore(
    ordoraStore.subscribe,
    ordoraStore.getState,
    ordoraStore.getState // Server snapshot
  );

  return {
    ...state,
    ...ordoraStore,
  };
}
