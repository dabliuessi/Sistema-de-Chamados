import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const perfil = localStorage.getItem("perfil");
        const id = localStorage.getItem("id");
        if (token && perfil) setUser({ token, perfil, id });
    }, []);

    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("perfil", data.perfil);
        localStorage.setItem("id", data.id);
        setUser(data);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
