'use client';

import { authAPI, setAuthToken } from "@/services/api";
import { useStorageState } from "@hooks/useStorageState";
import { LoginRequest } from "@interfaces/Auth/LoginRequest";
import { RegisterRequest } from "@interfaces/Auth/RegisterRequest";
import { createContext, ReactNode, useContext } from "react";

interface AuthContextType {
    register: (SignupRequest: RegisterRequest) => Promise<void>;
    login: (loginRequest: LoginRequest) => Promise<void>;
    logout: () => void;
    session?: string | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loginHandler(
    loginRequest: LoginRequest,
    setSession: (value: string) => void,
) {
    const response = await authAPI.login(loginRequest);
    console.log(response.data);
    setSession(response.data.result.token);
}

async function signupHandler(
    signupRequest: RegisterRequest,
    setSession: (value: string) => void,
) {
    await authAPI.register(signupRequest);
    const response = await authAPI.login(signupRequest);
    setSession(response.data.result.token);
}

export function AuthProvider(props: { children: ReactNode }) {
    const [[isLoading, session], setSession] = useStorageState("token");

    if (session)
        setAuthToken(session);

    return (
        <AuthContext.Provider
            value={{
                register: (signupRequest) => signupHandler(signupRequest, setSession),
                login: (loginRequest) => loginHandler(loginRequest, setSession),
                logout: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error("useAuthContext must be used within a AuthProvider");
    return context;
}
