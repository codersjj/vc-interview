import path from 'path'
import express from "express"
import { ENV } from "./lib/env.js"

const app = express()

const __dirname = path.resolve()

app.get('/api/health', (req, res) => {
  res.status(200).json({ msg: 'api is up and running' })
})

app.get('/api/books', (req, res) => {
  res.status(200).json({ msg: 'this is the books endpoint' })
})


// And for development only start the server if we're not in a serverless environment
// This will only happen locally in development mode
if (ENV.NODE_ENV !== 'production') {
  // Serve static files from the dist directory
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  // Serve index.html for all other requests
  // see: https://expressjs.com/en/guide/migrating-5.html#path-syntax
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
  })

  // Start the server
  app.listen(ENV.PORT, () => console.log('Server is running on port:', ENV.PORT))
}


// 导出 app 供 Vercel 使用
export default app
