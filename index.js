import express from 'express'
import morgan from 'morgan'

const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
}
]

app.use(express.json())

const logger = (tokens, req, res)=>{
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}

app.use(morgan(logger))

app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(!person){
        return res.status(404).json({error: "Person not found"})
    }
    return res.json(person)
})

app.post('/api/persons', (req,res)=>{
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({error:'number or name missing'})
    }
    if(persons.some(p => p.name === body.name)){
        return res.status(400).json({ error: 'name must be unique' })
    }
    const person = {
        id: Math.floor(Math.random() * 100000) + 1,
        name: body.name,
        number : body.number
    }
    persons = persons.concat(person)

    return res.json(person)
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(!person){
        return res.status(404).json({error: "Person not found"})
    }
    persons = persons.filter(p => p.id !== id)
    return res.status(204).end()
})

app.get('/info',(req,res)=>{
    const date = new Date()
    const cant = persons.length
    res.send(`<p>Phonebook has info for ${cant} people</p><p>${date.toString()}</p>`)
})


const PORT = 3001
app.listen(PORT, ()=>{
console.log(`server running on port http://localhost:${PORT}`)
})