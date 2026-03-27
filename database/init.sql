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
-- For existing DBs, run these ALTERs:
-- ALTER TABLE tasks ADD COLUMN descricao TEXT AFTER title;
-- ALTER TABLE tasks ADD COLUMN lista VARCHAR(100) DEFAULT 'Pessoal' AFTER status;
-- ALTER TABLE tasks ADD COLUMN data_vencimento DATE AFTER lista;
-- ALTER TABLE tasks ADD COLUMN etiquetas JSON AFTER data_vencimento;
-- ALTER TABLE tasks ADD COsiow,LUMN subtarefas JSON AFTER etiquetas;