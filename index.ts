import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'

const app = express()

const PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const client = new MongoClient('mongodb://db:27017/')
const db = client.db('todolist')
const collection = db.collection('tasks')

app.get('/todolist', async (req, res) => {
    try {
        const tasks = await collection.find({}).toArray()

        res.status(200)
        res.json(tasks)
    }
    catch (error: any) {
        res.status(500)
        res.json(error)
    }
})

app.post('/todolist', async (req, res) => {
    try {
        const { content, limitDate, extraInfo } = req.body

        const newTask = {
            content,
            limitDate,
            extraInfo
        }

        if (newTask.content !== undefined && newTask.limitDate !== undefined) {
            const task = await collection.insertOne(newTask)
            res.json(task)
        }
        else {
            throw {
                code: 400,
                message: 'Missing content or limitDate'
            }
        }
    }
    catch (error: any) {
        res.status(error.code || 500)
        res.send(error.message)
    }
})

app.get('/todolist/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            throw {
                code: 400,
                message: 'Missing id'
            }
        }

        const task = await collection.findOne({ _id: new ObjectId(id) })
        if (!task) {
            throw {
                code: 404,
                message: 'Task not found'
            }
        }

        res.send(task)
    }
    catch (error: any) {
        res.status(error.code || 500)
        res.json(error.message)
    }
})

app.put('/todolist/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            throw {
                code: 400,
                message: 'Missing id'
            }
        }

        const { content, limitDate, extraInfo } = req.body

        if (!content || !limitDate) {
            throw {
                code: 400,
                message: 'Missing content or limitDate'
            }
        }

        const task = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                content,
                limitDate,
                extraInfo
            }
        })


        res.status(200)
        res.send(task)
    }
    catch (error: any) {
        res.status(error.code || 500)
        res.json(error.message)
    }
})

app.delete('/todolist/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            throw {
                code: 400,
                message: 'Missing id'
            }
        }

        const task = await collection.findOneAndDelete({ _id: new ObjectId(id) })

        res.status(200)
        res.send(task)
    }
    catch (error: any) {
        res.status(error.code || 500)
        res.json(error.message)
    }
})

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on https://localhost:${PORT}`);
    })
})