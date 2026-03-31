CREATE DATABASE IF NOT EXISTS todolist;
USE todolist;
CREATE TABLE IF NOT EXISTS tasks(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    descricao TEXT,
    status ENUM('pendente', 'em andamento', 'concluida') DEFAULT 'pendente',
    lista VARCHAR(100) DEFAULT 'Pessoal',
    data_vencimento DATE,
    etiquetas JSON,
    subtarefas JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

