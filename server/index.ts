import { env } from 'node:process'
import express from 'express'
import type { Request, Response } from 'express'

const app = express()

app.get('/ping', (req: Request, res: Response) => {
    res.send('PONG')
})

const PORT = Number(env.PORT ?? 3000)
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})