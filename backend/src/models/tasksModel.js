const connection = require('./connection');

const getAll = async () => {
    const [tasks] = await connection.execute('SELECT * FROM tasks');
    return tasks;
};

const createTask = async (task) => {
    const { title } = task;

    const query = 'INSERT INTO tasks(title, status) VALUES(?, ?)';
    const [result] = await connection.execute(query, [title, 'pendente']);

// ERRO DATA
    return {
        id: result.insertId,
        title,
        status: 'pendente',
        create_at: new Date().toISOString() 
    };
};

const deleteTask = async (id) => {
    const [result] = await connection.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows; 
};

const updateTask = async (id, task) => {
    const {title, status} = task;

    const query = 'UPDATE tasks SET title = ?, status = WHERE id = ?';
    const [updatedTask] = await connection.execute(query, [title, status, id]);
    
    return updatedTask;

};

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
};
