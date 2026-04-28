import { createContext, type PropsWithChildren, useReducer } from 'react';
import useSWR from 'swr';

import { useAuth } from '@/hooks/use-auth';
import type { LoggedUser } from '@/types';

type Theme = 'dark' | 'light';

type AppState = {
    loggedUser: LoggedUser | null;
    theme: Theme;
};

type AppAction =
    | { type: 'SET_LOGGED_USER'; payload: LoggedUser | null }
    | { type: 'SET_THEME'; payload: Theme };

const initialState: AppState = {
    loggedUser: null,
    theme: 'light',
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'SET_LOGGED_USER':
            return { ...state, loggedUser: action.payload };
        default:
            return state;
    }
}

type AppContext = [AppState, React.Dispatch<AppAction>];

const defaultContext: AppContext = [initialState, () => null];

export const AppContext = createContext<AppContext>(defaultContext);

export default function AppContextProvider({ children }: PropsWithChildren) {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { getAuthenticatedUser } = useAuth();

    const { data } = useSWR('/auth/me', getAuthenticatedUser, {
        onSuccess: (data) =>
            dispatch({ payload: data, type: 'SET_LOGGED_USER' }),
    });

    return (
        <AppContext.Provider value={[{ ...state, loggedUser: data }, dispatch]}>
            {children}
        </AppContext.Provider>
    );
}
