import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({ message: "", type: "" });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", { email, senha });
            const tokenData = JSON.parse(atob(data.token.split(".")[1]));
            login({ token: data.token, perfil: tokenData.perfil, id: tokenData.id });

            setPopup({ message: "Login realizado com sucesso!", type: "success" });
            setTimeout(() => setPopup({ message: "", type: "" }), 2500);

            setTimeout(() => {
                if (tokenData.perfil === "tecnico") navigate("/tecnico");
                else navigate("/");
            }, 1000);
        } catch (err) {
            setPopup({ message: err.response?.data?.message || "Erro ao logar.", type: "error" });
            setTimeout(() => setPopup({ message: "", type: "" }), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="form-card">
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6a11cb" viewBox="0 0 24 24">
                                <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                                <circle cx="12" cy="12" r="2.5" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6a11cb" viewBox="0 0 24 24">
                                <path d="M12 5c-7 0-11 7-11 7s4 7 11 7a11.4 11.4 0 0 0 4.14-.7l2.56 2.56 1.41-1.41-2.54-2.55a11.1 11.1 0 0 0 2.43-2.43s-4-7-11-7zm0 12a5 5 0 0 1-5-5c0-.5.1-.99.25-1.44l6.19 6.19A4.98 4.98 0 0 1 12 17zm0-10a5 5 0 0 1 5 5c0 .5-.1.99-.25 1.44l-6.19-6.19A4.98 4.98 0 0 1 12 7z" />
                            </svg>
                        )}
                    </span>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? <div className="loader"></div> : "Entrar"}
                </button>

                <p className="register-link">
                    Não tem uma conta? <Link to="/register">Registre-se aqui</Link>
                </p>
            </form>

            {popup.message && <div className={`popup ${popup.type}`}>{popup.message}</div>}

            <style jsx>{`
        body { margin: 0; font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #6a11cb, #2575fc); }
        .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; padding: 20px; }
        .form-card { background: #fff; padding: 40px; border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); width: 100%; max-width: 400px; text-align: center; animation: slideDown 0.5s ease; position: relative; }
        .form-card h2 { margin-bottom: 25px; color: #333; font-size: 28px; }
        .form-card input { width: 90%; padding: 13px 15px; margin: 12px 0; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; }
        .form-card input:focus { border-color: #6a11cb; box-shadow: 0 0 8px rgba(106,17,203,0.3); outline: none; }

        /* Container senha com ícone */
        .password-container { position: relative; width: 92%; margin: 3px; }
        .password-container input { width: 100%; padding-right: 8px; }
        .toggle-password { position: absolute; right: 2px; top: 50%; transform: translateY(-50%); cursor: pointer; }

        .form-card button { width: 100%; padding: 12px; margin-top: 15px; background: linear-gradient(45deg, #6a11cb, #2575fc); color: #fff; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; transition: all 0.3s ease; display: flex; justify-content: center; align-items: center; }
        .form-card button:disabled { opacity: 0.7; cursor: not-allowed; }
        .form-card button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }

        .register-link { margin-top: 15px; font-size: 14px; color: #555; }
        .register-link a { color: #6a11cb; text-decoration: none; font-weight: 500; transition: color 0.3s ease; }
        .register-link a:hover { color: #2575fc; text-decoration: underline; }

        @keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .popup { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 8px; color: #fff; font-weight: 600; animation: fadeInOut 3s ease forwards; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 1000; }
        .popup.success { background-color: #2ecc71; }
        .popup.error { background-color: #e74c3c; }
        @keyframes fadeInOut { 0% { opacity: 0; transform: translateY(-20px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }

        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #6a11cb; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
