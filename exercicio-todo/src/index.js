const express = require("express");
const cors = require('cors');

const { v4: uuidv4 } = require('uuid')

const app = express();
app.use(cors()); 

const Users = []

/**
 * id - uuid
 * name - string
 * username - string
 * todos []
 */

function checkExistsUserAccount(request, response, next) {
  const { username } = request.headers
  
  const user = Users.find(user => user.username === username)

  if (!user) {
    return response.status(404).json({error: 'User not found'})
  }

  request.user = user
  return next()
}

app.use(express.json())


app.post("/users", (request, response) => {
  const { name, username } = request.body
  
  const UsersAlreadyExists = Users.some((user) => user.username === username)

  if (UsersAlreadyExists) {
    return response.status(400).json({error: "User already exists"})
  }

  Users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  })

  return response.status(201).send()
})

/**
 * receber o username e mostrar o todos
 */
app.get("/todos", checkExistsUserAccount, (request, response) => {
  const { user } = request
  return response.json(user.todos)
})

app.post("/todos", checkExistsUserAccount, (request, response) => {
  const { user } = request

  const { title, deadline } = request.body

  const todosOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todosOperation)

  return response.status(201).send()
})

//mudar o title
app.put("/todos/:id", checkExistsUserAccount, (request, response) => {
  const { id } = request.params
  
  const { user } = request
  
  const { title, deadline } = request.body


  const todo = user.todos.find(todo => todo.id === id)

  if(!todo) {
    return response.status(404).json({error: "ToDo not found"})
  }
  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
})

app.patch("/todos/:id/done", checkExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo) {
    return response.status(404).json({error: "ToDo not found"})
  }
  todo.done = true

  return response.json(todo)
})

app.delete("/todos", checkExistsUserAccount, (request, response) => {  
  const { user } = request

  //slice
  Users.splice(user, 1)

  return response.status(200).json(Users)
})

app.listen(3333)