import './index.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
import { SWRConfig } from 'swr';
import { Toaster } from '@/components/ui/sonner';

import AppContextProvider from './context/AppContext';
import fetcher from './lib/fetcher';
import swrCacheProvider from './lib/swr-cache-provider';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

createRoot(document.getElementById('root')!).render(
    <SWRConfig value={{ fetcher, provider: swrCacheProvider }}>
        <AppContextProvider>
            <RouterProvider
                defaultPendingComponent={() => <h1>Loading...</h1>}
                router={router}
            />
            <Toaster />
        </AppContextProvider>
    </SWRConfig>,
);
