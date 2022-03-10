import express from 'express'
import { MongoClient } from 'mongodb'

const PORT = process.env.PORT || 3000

const app = express()
app.set('view engine', 'pug')

const client = new MongoClient('mongodb://mongo:27017/')

app.get('/', (req, res) => {

    const { firstname } = req.query as {
        firstname?: string
    }

    res.render('index', {
        firstname: firstname || 'john'
    })
})
    .listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/`)
    })