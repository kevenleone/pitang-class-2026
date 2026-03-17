import { useAuth } from "@/hooks/use-auth";
import type { LoggedUser } from "@/types";
import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type Theme = "dark" | "light";

type AppContext = {
  loggedUser: null | LoggedUser;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const defaultContext = {
  loggedUser: null,
  theme: "light",
  setTheme: () => null,
} as const;

export const AppContext = createContext<AppContext>(defaultContext);

export default function AppContextProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>("light");
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);
  const { getAuthenticatedUser } = useAuth();

  useEffect(() => {
    getAuthenticatedUser()
      .then((response) => setLoggedUser(response))
      .catch(console.error);
  }, []);

  return (
    <AppContext.Provider
      value={{ ...defaultContext, loggedUser, theme, setTheme }}
    >
      {children}
    </AppContext.Provider>
  );
}
