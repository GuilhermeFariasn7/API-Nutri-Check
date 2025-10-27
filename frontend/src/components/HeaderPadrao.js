import React from "react";
import { useNavigate } from "react-router-dom";
import { Undo, ArrowLeft} from "lucide-react";


function HeaderPadrao({ titulo = "NutriCheck", destino = -1 }) {
    const navigate = useNavigate();

    const handleVoltar = () => {
        if (typeof destino === "string") {
            navigate(destino);
        } else {
            navigate(-1); // Volta para a tela anterior
        }
    };

    return (
        <header className="header-padrao">
            <button className="btn-voltar" onClick={handleVoltar}>
                <ArrowLeft/>
                <p className="btn-voltar-text">Voltar</p>
            </button>
            <h1 className="titulo-header">{titulo}</h1>
        </header>
    );
}

export default HeaderPadrao;
