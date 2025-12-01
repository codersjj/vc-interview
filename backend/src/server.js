import path from 'path'
import express from "express"
import { ENV } from "./lib/env.js"

const app = express()

const __dirname = path.resolve()

app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'api is up and running' })
})

app.get('/books', (req, res) => {
  res.status(200).json({ msg: 'this is the books endpoint' })
})

// ❗ 注意：不要写 app.listen()
// Vercel 会自动创建 HTTP server 并调用你的 Express app

export default app;   // <-- 必须导出 app
