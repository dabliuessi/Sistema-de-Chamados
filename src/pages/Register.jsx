import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
    const [form, setForm] = useState({ nome: "", email: "", senha: "", perfil: "usuario" });
    const [popup, setPopup] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            await api.post("/auth/register", form);
            setPopup({ message: "Usuário cadastrado com sucesso!", type: "success" });

            setTimeout(() => {
                setPopup({ message: "", type: "" });
                navigate("/login");
            }, 2000);
        } catch (err) {
            setPopup({ message: err.response?.data?.message || "Erro ao cadastrar.", type: "error" });
            setTimeout(() => setPopup({ message: "", type: "" }), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="form-card">
                <h2>Registrar</h2>
                <input
                    name="nome"
                    placeholder="Nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    name="senha"
                    type="password"
                    placeholder="Senha"
                    value={form.senha}
                    onChange={handleChange}
                    required
                />
                <select name="perfil" value={form.perfil} onChange={handleChange}>
                    <option value="usuario">Usuário</option>
                    <option value="tecnico">Técnico</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? <div className="loader"></div> : "Cadastrar"}
                </button>
            </form>

            {popup.message && (
                <div className={`popup ${popup.type}`}>
                    {popup.message}
                </div>
            )}

            <style>{`
                body {
                    margin: 0;
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #6a11cb, #2575fc);
                }
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    padding: 20px;
                }
                .form-card {
                    background: #fff;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                    animation: slideDown 0.5s ease;
                    position: relative;
                }
                .form-card h2 {
                    margin-bottom: 25px;
                    color: #333;
                    font-size: 28px;
                }
                .form-card input,
                .form-card select {
                    width: 90%;
                    padding: 12px 15px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                .form-card input:focus,
                .form-card select:focus {
                    border-color: #6a11cb;
                    box-shadow: 0 0 8px rgba(106,17,203,0.3);
                    outline: none;
                }
                .form-card button {
                    width: 100%;
                    padding: 12px;
                    margin-top: 15px;
                    background: linear-gradient(45deg, #6a11cb, #2575fc);
                    color: #fff;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .form-card button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .form-card button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
                }

                /* Loader */
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #6a11cb;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes slideDown {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .popup {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 25px;
                    border-radius: 8px;
                    color: #fff;
                    font-weight: 600;
                    animation: fadeInOut 3s ease forwards;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 1000;
                }
                .popup.success { background-color: #2ecc71; }
                .popup.error { background-color: #e74c3c; }
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
}
