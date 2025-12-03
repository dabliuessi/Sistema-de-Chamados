import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />;
    if (role && user.perfil !== role) return <Navigate to="/" />;

    return children;
}
