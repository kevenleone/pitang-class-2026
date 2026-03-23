import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "@/components/ui/sonner";
import AppContextProvider from "./context/AppContext";

import "./index.css";
import { SWRConfig } from "swr";
import swrCacheProvider from "./lib/swr-cache-provider";

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <SWRConfig value={{ provider: swrCacheProvider }}>
    <AppContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AppContextProvider>
  </SWRConfig>,
);
