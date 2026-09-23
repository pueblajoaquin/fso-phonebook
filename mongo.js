import mongoose from "mongoose";
import dns from 'node:dns'

dns.setServers(["8.8.8.8"])

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://fso-joako:${password}@cluster0.mykzvqr.mongodb.net/fso-phonebook?appName=Cluster0`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)



if(process.argv.length < 4){
    Person.find({}).then(people => {
        console.log('phonebook:')
        people.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}