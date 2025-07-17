const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
morgan.token('body', (request) => {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :response-time ms - :body'))
app.use(cors())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World<h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people<p>
        <p>${new Date().toString()}<p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    person = persons.find(person => person.id === request.params.id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== request.params.id)

    response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * 9999999999999))
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        name: body.name,
        id: generateId(),
        number: body.number
    }
    persons = persons.concat(person)
    response.json(persons)
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    const personIndex = persons.findIndex(person => person.id === id)
    if (personIndex === -1) {
        return response.status(404).json({ error: 'person not found'})
    }

    const updatedPerson = { ...persons[personIndex], ...body }
    persons[personIndex] = updatedPerson
    response.json(updatedPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})