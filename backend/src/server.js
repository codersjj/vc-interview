import path from 'path'
import express from "express"
import { serve } from "inngest/express"
import { clerkMiddleware } from '@clerk/express'
import { ENV } from "./lib/env.js"
import { connectDB } from './lib/db.js'
import { inngest, functions } from "./lib/inngest.js"
import { protectRoute } from './middleware/protectRoute.js'
import chatRoutes from './routes/chatRoutes.js'

export const app = express()

const __dirname = path.resolve()

// Important: ensure you add JSON middleware to process incoming JSON POST payloads.
app.use(express.json());
app.use(clerkMiddleware()) // this adds auth field to request object: req.auth()
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/chat', chatRoutes)

app.get('/health', (req, res) => {
  console.log('auth:', req.auth())
  res.status(200).json({ message: 'api is up and running' })
})

app.get('/books', (req, res) => {
  res.status(200).json({ message: 'this is the books endpoint' })
})

// when you pass an array of middleware to Express, it automatically flattens and executes them sequentially, one by one.
app.get('/video-calls', protectRoute, (req, res) => {
  console.log("🚀 ~ req.user:", req.user)
  res.status(200).json({ message: 'video call endpoint' })
})

// make our app ready for deployment
if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  // see: https://expressjs.com/en/guide/migrating-5.html#path-syntax
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
  })
}


const startServer = async () => {
  try {
    await connectDB()
    app.listen(ENV.PORT, () => console.log('Server is running on port:', ENV.PORT))
  } catch (error) {
    console.error('💥 Error starting the server:', error)
    process.exit(1) // 0 means success, 1 means failure
  }
}

if (ENV.NODE_ENV !== 'test') {
  startServer()
}
