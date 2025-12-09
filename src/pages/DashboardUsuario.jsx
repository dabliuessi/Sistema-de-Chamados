import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function DashboardUsuario() {
    const [chamados, setChamados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("Baixa");
    const [categoria, setCategoria] = useState("Software");

    const [popup, setPopup] = useState({ show: false, message: "", type: "" });
    const [confirm, setConfirm] = useState({ show: false, id: null });

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    useEffect(() => {
        api.get("/chamados/meus").then((res) => setChamados(res.data));
    }, []);

    const showNotification = (message, type = "success") => {
        setPopup({ show: true, message, type });
        setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
    };

    const openEditModal = (chamado) => {
        setEditMode(true);
        setEditId(chamado.id);
        setTitulo(chamado.titulo);
        setDescricao(chamado.descricao);
        setPrioridade(chamado.prioridade);
        setCategoria(chamado.categoria);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);

        try {
            if (editMode) {
                const res = await api.put(`/chamados/${editId}`, {
                    titulo,
                    descricao,
                    prioridade,
                    categoria,
                });

                setChamados((prev) =>
                    prev.map((c) => (c.id === editId ? res.data : c))
                );

                showNotification("Chamado atualizado!");
            } else {
                const res = await api.post("/chamados", {
                    titulo,
                    descricao,
                    prioridade,
                    categoria,
                });

                setChamados((prev) => [...prev, res.data]);
                showNotification("Chamado criado com sucesso!");
            }

            setShowModal(false);
            setEditMode(false);
            setEditId(null);
            setTitulo("");
            setDescricao("");
            setPrioridade("Baixa");
            setCategoria("Software");

        } catch {
            showNotification(editMode ? "Erro ao atualizar" : "Erro ao criar", "error");
        } finally {
            setLoadingCreate(false);
        }
    };

    const requestDelete = (id) => setConfirm({ show: true, id });

    const handleDelete = async () => {
        const id = confirm.id;
        setLoadingDelete(true);
        try {
            await api.delete(`/chamados/${id}`);
            setChamados((prev) => prev.filter((c) => c.id !== id));
            showNotification("Chamado excluído com sucesso!");
        } catch {
            showNotification("Erro ao excluir chamado", "error");
        } finally {
            setLoadingDelete(false);
            setConfirm({ show: false, id: null });
        }
    };

    const cancelDelete = () => setConfirm({ show: false, id: null });

    const getStatusColor = (status) => {
        switch (status) {
            case "Aberto": return "#f39c12";
            case "Em andamento": return "#3498db";
            case "Concluído": return "#2ecc71";
            default: return "#7f8c8d";
        }
    };

    const statusLabels = {
        "aberto": "Aberto",
        "em_andamento": "Em andamento",
        "concluido": "Concluído",
    };

    const getPrioridadeColor = (p) => {
        switch (p) {
            case "Alta": return "#e74c3c";
            case "Média": return "#f1c40f";
            case "Baixa": return "#2ecc71";
            default: return "#7f8c8d";
        }
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h2>Meus Chamados</h2>

                <div className="cards-container">
                    {chamados.length > 0 ? (
                        chamados.map((c) => (
                            <div key={c.id} className="chamado-card">
                                <h3>{c.titulo}</h3>
                                <p>{c.descricao}</p>
                                <div className="tags">
                                    <span className="status" style={{ backgroundColor: getStatusColor(c.status) }}>
                                        {statusLabels[c.status] || c.status}
                                    </span>
                                    <span className="prioridade" style={{ backgroundColor: getPrioridadeColor(c.prioridade) }}>
                                        {c.prioridade}
                                    </span>
                                    <span className="categoria">{c.categoria}</span>
                                </div>

                                <button className="btn-edit" onClick={() => openEditModal(c)}>Editar</button>

                                <button className="btn-delete" onClick={() => requestDelete(c.id)}>Excluir</button>
                            </div>
                        ))
                    ) : (
                        <div className="no-chamados">
                            <p>Você não possui nenhum chamado no momento.</p>
                            <p>Clique no botão <strong>+</strong> para criar um novo chamado.</p>
                        </div>
                    )}
                </div>

                <button className="btn-new" onClick={() => {
                    setEditMode(false);
                    setShowModal(true);
                }}>+</button>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>{editMode ? "Editar Chamado" : "Novo Chamado"}</h3>
                            <form onSubmit={handleSubmit}>
                                <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                                <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required></textarea>
                                <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                                    <option>Baixa</option>
                                    <option>Média</option>
                                    <option>Alta</option>
                                </select>
                                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                                    <option>Software</option>
                                    <option>Hardware</option>
                                    <option>Rede</option>
                                </select>
                                <div className="modal-actions">
                                    <button type="submit" className="btn-submit" disabled={loadingCreate}>
                                        {loadingCreate ? <div className="loader"></div> : editMode ? "Salvar" : "Criar"}
                                    </button>
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {popup.show && <div className={`popup ${popup.type}`}>{popup.message}</div>}

                {confirm.show && (
                    <div className="popup-confirm">
                        <p>Deseja realmente excluir este chamado?</p>
                        <div className="confirm-actions">
                            <button onClick={handleDelete} className="btn-submit" disabled={loadingDelete}>
                                {loadingDelete ? <div className="loader"></div> : "Confirmar"}
                            </button>
                            <button onClick={cancelDelete} className="btn-cancel">Cancelar</button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                * { font-family: 'Poppins', sans-serif; }
                .dashboard-container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
                h2 { text-align: center; margin-bottom: 30px; color: #333; }

                .cards-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
                .chamado-card { background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: transform 0.2s; position: relative; }
                .chamado-card:hover { transform: translateY(-5px); }

                .chamado-card h3 { margin-top: 0; color: #2c3e50; }
                .chamado-card p { color: #555; margin: 10px 0; }

                .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
                .tags span { padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #fff; }

                .btn-edit {
                    position: absolute;
                    top: 15px;
                    right: 80px;
                    background-color: #2980b9;
                    color: #fff;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                }
                .btn-edit:hover { background-color: #1f6691; }

                .btn-delete {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background-color: #e74c3c;
                    color: #fff;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                }
                .btn-delete:hover { background-color: #c0392b; }

                .no-chamados { text-align: center; color: #555; font-size: 16px; padding: 40px 0; }

                .btn-new {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    font-size: 30px;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    animation: pulse 2s infinite;
                }
                .btn-new:hover { background-color: #2980b9; }

                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                    50% { transform: scale(1.1); box-shadow: 0 6px 14px rgba(0,0,0,0.3); }
                    100% { transform: scale(1); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                }

                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
                .modal { background: #fff; padding: 30px; border-radius: 10px; width: 400px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: slideDown 0.3s ease-out; }

                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .modal input, .modal textarea, .modal select {
                    width: 100%;
                    padding: 10px;
                    margin: 8px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 14px;
                    box-sizing: border-box;
                }

                .modal textarea { resize: none; height: 80px; }

                .modal-actions { display: flex; justify-content: flex-end; margin-top: 15px; }
                .btn-submit {
                    background-color: #2ecc71;
                    color: #fff;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .btn-submit:hover { background-color: #27ae60; }

                .btn-cancel {
                    background-color: #e74c3c;
                    color: #fff;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-left: 10px;
                }
                .btn-cancel:hover { background-color: #c0392b; }

                .popup {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 5px;
                    color: #fff;
                    font-weight: 500;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    z-index: 2000;
                    opacity: 0.95;
                    animation: fadeInOut 3s forwards;
                }
                .popup.success { background-color: #2ecc71; }
                .popup.error { background-color: #e74c3c; }

                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-20px); }
                    10% { opacity: 0.95; transform: translateY(0); }
                    90% { opacity: 0.95; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }

                .popup-confirm {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #fff;
                    padding: 20px 30px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    z-index: 3000;
                    text-align: center;
                }

                .confirm-actions {
                    margin-top: 15px;
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }

                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #6a11cb;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    animation: spin 1s linear infinite;
                    margin: auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
