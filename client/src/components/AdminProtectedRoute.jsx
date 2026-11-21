import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {

    const [status, setStatus] = useState("checking");

    useEffect(() => {

        const checkAdmin = async () => {
            try {
                const res = await fetch("http://localhost:5000/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    setStatus("guest");
                    return;
                }

                const data = await res.json();

                if (data.user?.role === "admin") {
                    setStatus("admin");
                } else {
                    setStatus("customer");
                }

            } catch (error) {
                console.log("Authentication error:", error);
                setStatus("guest");
            }
        };

        checkAdmin();

    }, []);

    if (status === "checking") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-violet-700 font-semibold">
                    Checking authentication...
                </p>
            </div>
        );
    }

    if (status === "guest") {
        return <Navigate to="/login" replace />;
    }

    if (status === "customer") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;