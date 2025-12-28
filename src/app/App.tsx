import { StoreProvider } from './providers/StoreProvider';
import { RouterProvider } from './providers/RouterProvider';

export function App() {
  return (
    <StoreProvider>
      <RouterProvider />
    </StoreProvider>
  );
}
