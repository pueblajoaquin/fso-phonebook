import mongoose from "mongoose"
import dns from 'node:dns'

dns.setServers(["8.8.8.8"])

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('conecting to data base... \n')

mongoose.connect(url)
    .then( result => console.log('connected to MongoDB'))
    .catch( err => console.log('error connecting to MongoDB:', err.message))


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number:{
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (value) => /^\d{2,3}-\d+$/.test(value),
      message: props => `${props.value} no es un número de teléfono válido`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Person',personSchema)
