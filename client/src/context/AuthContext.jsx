import { createContext, useContext, useEffect, useState } from "react";
import API_URL from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check whether a user is already logged in
    const checkAuth = async () => {
        try {
            const res = await fetch(`${API_URL}/me`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok && data.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }

        } catch (error) {
            console.log("Authentication error:", error);
            setUser(null);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);