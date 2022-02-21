import express from 'express'
import Database from 'better-sqlite3'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 4000

const db = new Database('./data.db', {
    verbose: console.log
})

const getAllMuseums = db.prepare(`SELECT * FROM museums`)
const getAllWorks = db.prepare(`SELECT * FROM works`)
const getWorkById = db.prepare(`SELECT * FROM works WHERE id=?`)
const getMuseumById = db.prepare(`SELECT * FROM museums WHERE id=?`)
const createMuseum = db.prepare(`INSERT INTO museums (name, city) VALUES (?, ?);`)
const createWork = db.prepare(`INSERT INTO works (name, image, museumId) VALUES (?, ?, ?);`)

app.get('/museums', (req, res) => {
    const allMuseums = getAllMuseums.all()

    for (const museum of allMuseums) {
        museum.works = getWorkById.get(museum.id)
    }
    res.send(allMuseums)
})


app.get('/museums/:id', (req, res) => {
    const id = req.params.id
    const result = getMuseumById.get(id)

    const workResult = getWorkById.get(id)

    result.work = workResult

    console.log(result)
    res.send(result)
})

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});

app.get('/works', (req, res) => {
    const works = getAllWorks.all()

    for (const work of works) {
        const museum = getMuseumById.get(work.museumId)

        work.museumItBelongs = museum
    }

    res.send(works)
})

app.get('/works/:id', (req, res) => {
    const id = req.params.id

    const work = getWorkById.get(id)

    const museum = getMuseumById.get(work.museumId)

    work.museumItBelongs = museum

    res.send(work)
})

app.post('/museums', (req, res) => {
    const { name, city } = req.body

    const errors = []

    if (typeof name !== 'string') errors.push("Name missing or not a string")
    if (typeof city !== 'string') errors.push("City missing or not a string")

    if (errors.length === 0) {
        const result = createMuseum.run(name, city)
        const newMuseum = getMuseumById.get(result.lastInsertRowid)
        res.send(newMuseum)
    } else res.status(400).send({ errors: errors })
})

app.post('/works', (req, res) => {
    const { name, image, museumId } = req.body

    const errors = []

    if (typeof name !== 'string') errors.push("Name missing or not a string")
    if (typeof image !== 'string') errors.push("Image missing or not a string")
    if (typeof museumId !== 'number') errors.push("MuseumId missing or not a number")

    if (errors.length === 0) {
        const result = createWork.run(name, image, museumId)
        const newWork = getWorkById.get(result.lastInsertRowid)
        res.send(newWork)
    } else res.status(400).send({ errors: errors })
})