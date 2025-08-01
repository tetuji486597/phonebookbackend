const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give password as clarg')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://tetuji486597:${password}@panacea-cluster.8hhyh.mongodb.net/phonebook?retryWrites=true&w=majority&appName=panacea-cluster`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema, 'persons')

if(process.argv.length === 3) {

    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log('person saved')
        mongoose.connection.close()
    })
}