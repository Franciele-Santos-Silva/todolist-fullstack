const connection = require('./connection');

const getAll = async () => {
    const [tasks] = await connection.execute('SELECT * FROM tasks');
    return tasks;
};

const createTask = async (task) => {
    const { title } = task;

    const query = 'INSERT INTO tasks(title, status) VALUES(?, ?)';
    const [result] = await connection.execute(query, [title, 'pendente']);

    return {
        id: result.insertId,
        title,
        status: 'pendente',
        create_at: new Date().toISOString() 
    };
};

const deleteTask = async (id) => {
    const removedTasks = await connection.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return removedTasks;
};

module.exports = {
    getAll,
    createTask,
    deleteTask,
};



