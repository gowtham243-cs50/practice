import express from 'express'
import db from '../db.js'

const router = express.Router()
//getalll todos
router.get('/',(req,res)=>{
    console.log("Fetching todos for user:", req.userID); // Debugging line
    if (!req.userID) {
        console.log("user is not")
       return res.status(401).json({ message: "Unauthorized access" });
    }
 
    const getTodos = db.prepare(`SELECT * from todos WHERE user_id = ?`)
    const todos = getTodos.all(req.userID)
    res.json(todos)
})
// createa new todo

router.post('/', (req, res) => {
    const { task } = req.body;
    if (!req.userID) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    if (!task) {
        return res.status(400).json({ message: "Task is required" });
    }

    const createTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
    const result = createTodo.run(req.userID, task);

    if (result.changes > 0) {
        res.status(201).json({ message: "Todo created successfully", todoId: result.lastInsertRowid });
    } else {
        res.status(500).json({ message: "Failed to create todo" });
    }
});

//update a todo

router.put('/:id', (req, res) => {
    const { task, completed } = req.body;
    const todoId = req.params.id;

    if (!req.userID) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    const updateTodo = db.prepare(`UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?`);
    const result = updateTodo.run(task, completed, todoId, req.userID);

    if (result.changes > 0) {
        res.json({ message: "Todo updated successfully" });
    } else {
        res.status(404).json({ message: "Todo not found or no changes made" });
    }
});

//delete a todo

router.delete('/:id', (req, res) => {
    const todoId = req.params.id;

    if (!req.userID) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`);
    const result = deleteTodo.run(todoId, req.userID);

    if (result.changes > 0) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
});

export default router


 