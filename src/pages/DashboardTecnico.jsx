import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function DashboardTecnico() {
    const [chamados, setChamados] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const normalizeStatus = (s) =>
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    useEffect(() => {
        api.get("/chamados/todos").then((res) => setChamados(res.data));
    }, []);

    const atualizarStatus = async (id, novoStatus) => {
        setLoadingId(id);
        try {
            await api.patch(`/chamados/${id}/status`, { status: novoStatus });
            setChamados((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, status: novoStatus } : c
                )
            );
        } catch (err) {
            console.error("Erro ao atualizar status:", err);
        } finally {
            setLoadingId(null);
        }
    };

    const statusColors = {
        "aberto": "#f39c12",
        "em_andamento": "#3498db",
        "concluido": "#2ecc71",
    };

    const statusLabels = {
        "aberto": "Aberto",
        "em_andamento": "Em andamento",
        "concluido": "Concluído",
    };

    const chamadosPorStatus = {
        "aberto": chamados.filter(c => normalizeStatus(c.status) === "aberto"),
        "em_andamento": chamados.filter(c => normalizeStatus(c.status) === "em_andamento"),
        "concluido": chamados.filter(c => normalizeStatus(c.status) === "concluido")
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h2>Painel Técnico</h2>

                {["aberto", "em_andamento", "concluido"].map(status => (
                    <div key={status} className="status-section">
                        <h3>{statusLabels[status]}</h3>
                        <div className="cards-container">
                            {chamadosPorStatus[status].length === 0 && <p>Nenhum chamado</p>}
                            {chamadosPorStatus[status].map(c => (
                                <div key={c.id} className="chamado-card">
                                    <h4>{c.titulo}</h4>
                                    <p><strong>Usuário:</strong> {c.usuario?.nome}</p>
                                    <span className="status-tag" style={{ backgroundColor: statusColors[c.status] }}>
                                        {statusLabels[c.status] || c.status}
                                    </span>
                                    <div className="actions">
                                        {normalizeStatus(c.status) === "aberto" && (
                                            <button
                                                onClick={() => atualizarStatus(c.id, "em_andamento")}
                                                className="btn-attend"
                                                disabled={loadingId === c.id}
                                            >
                                                {loadingId === c.id ? <div className="loader"></div> : "Atender"}
                                            </button>
                                        )}
                                        {normalizeStatus(c.status) !== "concluido" && (
                                            <button
                                                onClick={() => atualizarStatus(c.id, "concluido")}
                                                className="btn-complete"
                                                disabled={loadingId === c.id}
                                            >
                                                {loadingId === c.id ? <div className="loader"></div> : "Concluir"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .dashboard-container {
                    max-width: 1000px;
                    margin: 40px auto;
                    padding: 0 20px;
                    font-family: 'Poppins', sans-serif;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 30px;
                    color: #333;
                }
                h3 {
                    margin-bottom: 15px;
                    color: #6a11cb;
                    border-bottom: 2px solid #6a11cb;
                    padding-bottom: 5px;
                }
                .status-section {
                    margin-bottom: 40px;
                    transition: all 0.3s ease;
                }
                .cards-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }
                .chamado-card {
                    background: linear-gradient(135deg, #fff, #f7f7f7);
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 6px 15px rgba(0,0,0,0.15);
                    transition: transform 0.3s, opacity 0.3s;
                }
                .chamado-card:hover {
                    transform: translateY(-5px);
                }
                .chamado-card h4 {
                    margin-top: 0;
                    color: #2c3e50;
                }
                .chamado-card p {
                    color: #555;
                    margin: 8px 0;
                }
                .status-tag {
                    display: inline-block;
                    padding: 5px 12px;
                    border-radius: 5px;
                    color: #fff;
                    font-weight: 600;
                    margin-bottom: 10px;
                    font-size: 13px;
                }
                .actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .actions button {
                    flex: 1;
                    padding: 8px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    color: #fff;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .actions button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .btn-attend {
                    background: #3498db;
                }
                .btn-attend:hover:not(:disabled) {
                    background: #2980b9;
                }
                .btn-complete {
                    background: #2ecc71;
                }
                .btn-complete:hover:not(:disabled) {
                    background: #27ae60;
                }
                p {
                    color: #777;
                    font-size: 14px;
                }

                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #6a11cb;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
