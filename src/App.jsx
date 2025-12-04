import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardUsuario from "./pages/DashboardUsuario";
import DashboardTecnico from "./pages/DashboardTecnico";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Login fica na rota "/" */}
      <Route path="/" element={<Login />} />

      {/* Opcional: se alguém entrar em /login, manda pra / */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/usuario"
        element={
          <ProtectedRoute>
            <DashboardUsuario />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tecnico"
        element={
          <ProtectedRoute role="tecnico">
            <DashboardTecnico />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
