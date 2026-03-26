import React from "react";
import useTasks from "../hooks/useTasks";

function Sidebar() {
  const { tarefas } = useTasks();
  const pendentesHoje = tarefas.filter((t) => !t.concluida).length;

  return (
    <nav className="sidebar">
      <div className="search-box">
        <input type="search" placeholder="Pesquisar" />
      </div>
      <div className="section">
        <h3>Tarefas</h3>
        <ul className="menu-list">
          <li className="menu-item active">
            Hoje <span className="badge">{pendentesHoje}</span>
          </li>
          <li className="menu-item">
            Próximas <span className="badge">0</span>
          </li>
          <li className="menu-item">Calendário</li>
          <li className="menu-item">Mural</li>
        </ul>
      </div>
      <div className="section">
        <h3>Listas</h3>
        <ul className="list-list">
          <li className="list-item">
            <span className="color-dot personal"></span> Pessoal{" "}
            <span className="badge">0</span>
          </li>
          <li className="list-item">
            <span className="color-dot work"></span> Trabalho{" "}
            <span className="badge">0</span>
          </li>
          <li className="list-item">
            <span className="color-dot list1"></span> Lista 1{" "}
            <span className="badge">0</span>
          </li>
          <li className="list-item add-new">+ Adicionar Nova Lista</li>
        </ul>
      </div>
      <div className="section tags-section">
        <h3>Etiquetas</h3>
        <div className="tags">
          <span className="tag tag1">Etiqueta 1</span>
          <span className="tag tag2">Etiqueta 2</span>
          <button className="add-tag-btn">+ Adicionar Etiqueta</button>
        </div>
      </div>
      <div className="section bottom-links">
        <button className="settings-btn">⚙ Configurações</button>
        <button className="signout-btn">↩ Sair</button>
      </div>
    </nav>
  );
}

export default Sidebar;
