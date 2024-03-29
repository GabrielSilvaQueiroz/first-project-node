const express = require('express')
const uuid = require('uuid')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())


const users = []

//Middleware
const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)     // find e findIndex no permite encontrar informações dentro do array (uma espécia de filter), o findIndex te traz a posição, o find te tras o nome, se ele não encontrar nada, te trará -1.

    if (index < 0) {
        return response.status(404).json({ message: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    try {

        const { name, age } = request.body

        if (age < 18) throw new Error("Only allowed users over 18 years old")

        const user = { id: uuid.v4(), name, age }

        users.push(user) //push sobe os elementos da variavel pra o vetor

        return response.status(201).json(user)

    } catch (err) {

        return response.status(400).json({ error: err.message })

    }


})

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age }

    users[index] = updateUser

    return response.json(updateUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()


})

app.listen(3001, () => {
    console.log("🚀 Server started on port 3001")
})