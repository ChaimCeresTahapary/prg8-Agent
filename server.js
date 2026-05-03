import express from 'express'
import cors from "cors";
import { callAssistant } from './agent.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.get('/api', (req, res) => {
    res.json({ response: 'Hello world' })
})

app.post('/api/chat', async (req, res) => {
    const message = req.body?.message ?? req.body?.prompt ?? "if prompt is empty, say something random about turtles"

    const reply = await callAssistant(message)
    res.json({ reply })
})

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "." })
})

// start web app
app.listen(process.env.EXPRESS_PORT, () => console.log(`Server on http://localhost:${process.env.EXPRESS_PORT}`))