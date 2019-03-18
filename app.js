
import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';
// Set up the express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all todos
// app.get makes a get request to the server with the route/endpoint provided as the first parameter, the endpoint is meant to return all the todos in the database. 
app.get('/api/v1/todos', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'todos retrieved successfully',
        todos: db
    })
});

const PORT = 5000;
// app.listen creates a web server for us
app.listen(PORT, () => {
    console.log("server running on port ${PORT}")
});


app.post('/api/v1/todos', (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        });
    } else if (!req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: 'description is required'
        });
    }
    const todo = {
        id: db.length + 1,
        title: req.body.title,
        description: req.body.description
    }
    db.push(todo);
    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        todo
    })
});


app.get('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.map((todo) => {
        if (todo.id === id) {
            return res.status(200).send({
                success: 'true',
                message: 'todo retrieved successfully',
                todo,
            });
        }
    });
    return res.status(404).send({
        success: 'false',
        message: 'todo does not exist',
    });
});


app.delete('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    db.map((todo, index) => {
        if (todo.id === id) {
            db.splice(index, 1);
            return res.status(200).send({
                success: 'true',
                message: 'Todo deleted successfuly',
            });
        }
    });


    return res.status(404).send({
        success: 'false',
        message: 'todo not found',
    });


});

// ust as usual we get the id of the todo we want to update from the URL, we loop through our dummy db to find the todo with that id, if we don’t find the todo then we return a message to the user saying todo not found. If we find the todo then we get new input supplied by the user, 
app.put('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let todoFound;
    let itemIndex;
    db.map((todo, index) => {
        if (todo.id === id) {
            todoFound = todo;
            itemIndex = index;
        }
    });

    if (!todoFound) {
        return res.status(404).send({
            success: 'false',
            message: 'todo not found',
        });
    }

    if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required',
        });
    } else if (!req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: 'description is required',
        });
    }

    const updatedTodo = {
        id: todoFound.id,
        title: req.body.title || todoFound.title,
        description: req.body.description || todoFound.description,
    };

    db.splice(itemIndex, 1, updatedTodo);

    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        updatedTodo,
    });
});