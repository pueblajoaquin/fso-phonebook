import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { writeFileSync } from 'node:fs'
import personsData from './db.json' with { type: 'json' }

const app = express()
const db = './db.json'
let persons = personsData

app.use(cors())

app.use(express.static('dist'))

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

app.post('/api/persons',  (req,res)=>{
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
    writeFileSync(db, JSON.stringify(persons, null, 2))

    return res.json(person)
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(!person){
        return res.status(404).json({error: "Person not found"})
    }
    persons = persons.filter(p => p.id !== id)
    writeFileSync(db,JSON.stringify(persons, null, 2))
    return res.status(200).json(person)
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