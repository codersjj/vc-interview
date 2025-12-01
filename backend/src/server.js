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

// 在 Vercel 中，静态服务和 catch-all 路由由 rewrites 处理，无需这里添加
// 移除 app.listen()，Vercel 会自动处理

// 必须导出 app，让 Vercel 作为 Serverless Function 使用
export default app
