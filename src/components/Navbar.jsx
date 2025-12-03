import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <nav className="navbar">
        <h1 className="logo">HelpDesk+</h1>
        {user && (
          <div className="nav-links">
            {user.perfil === "usuario" && <Link to="/">Meus Chamados</Link>}
            {user.perfil === "tecnico" && <Link to="/tecnico">Painel Técnico</Link>}
            <button className="btn-logout" onClick={logout}>Sair</button>
          </div>
        )}
      </nav>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          background: linear-gradient(135deg, #6a11cb,rgb(18, 105, 253));
          color: #fff;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          font-family: 'Segoe UI', sans-serif;
          letter-spacing: 1px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-links a {
          text-decoration: none;
          color: #ecf0f1;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 5px;
          transition: background 0.2s, color 0.2s;
        }

        .nav-links a:hover {
          background-color:#6a11cb;
          color: #fff;
        }

        .btn-logout {
          background-color: #e74c3c;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .btn-logout:hover {
          background-color: #c0392b;
        }

        @media (max-width: 600px) {
          .navbar {
            flex-direction: column;
            gap: 10px;
            padding: 10px 20px;
          }

          .nav-links {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}
