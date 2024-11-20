import { create } from 'zustand';
import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';
import type { AppRouter } from '@/server/routers/_app';
import superjson from 'superjson';

interface TRPCStore {
  client: ReturnType<typeof createTRPCProxyClient<AppRouter>> | null;
  initialize: () => void;
}

const wsClient = createWSClient({
  url: `ws://localhost:3001`,
});

export const useTRPCStore = create<TRPCStore>((set) => ({
  client: null,
  initialize: () => {
    const client = createTRPCProxyClient<AppRouter>({
      links: [
        wsLink({
          client: wsClient,
        }),
      ],
      transformer: superjson,
    });
    set({ client });
  },
})); 