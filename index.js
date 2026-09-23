import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'

const app = express()

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
    Person
        .find({})
        .then(people => {
            res.json(people)
        })
})

app.get('/api/persons/:id',(req,res)=>{
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(person)
        })
})

app.post('/api/persons',  (req,res)=>{
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({error:'number or name missing'})
    }

    const person = new Person({
        name: body.name,
        number : body.number
    })

    person
        .save()
        .then(savedPerson => {
            res.json(savedPerson)
        })

})

//app.delete('/api/persons/:id',(req,res)=>{
//    const id = Number(req.params.id)
//    const person = persons.find(p => p.id === id)
//    if(!person){
//        return res.status(404).json({error: "Person not found"})
//    }
//    persons = persons.filter(p => p.id !== id)
//    writeFileSync(db,JSON.stringify(persons, null, 2))
//    return res.status(200).json(person)
//})

app.get('/info',(req,res)=>{
    const date = new Date()
    res.send(`<p>Phonebook has info for ???? people</p><p>${date.toString()}</p>`)
})


const PORT = process.env.PORT
app.listen(PORT, ()=>{
console.log(`server running on port http://localhost:${PORT}`)
})