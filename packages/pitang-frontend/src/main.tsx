import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "@/components/ui/sonner";
import AppContextProvider from "./context/AppContext";

import { SWRConfig } from "swr";
import swrCacheProvider from "./lib/swr-cache-provider";
import fetcher from "./lib/fetcher";

import "./index.css";

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <SWRConfig value={{ fetcher, provider: swrCacheProvider }}>
    <AppContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AppContextProvider>
  </SWRConfig>,
);
