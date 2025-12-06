import { createUserToken } from "../lib/stream.js"

export const getStreamToken = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' })
    }

    const {
      clerkId,
      name,
      profileImage
    } = req.user

    if (!clerkId) {
      return res.status(400).json({ message: 'Bad Request: User ID is required' })
    }

    // use clerkId for Stream (not mongodb _id) => it should match the id we have in the Stream dashboard
    const token = createUserToken(clerkId)

    res.status(200).json({
      token,
      userId: clerkId,
      userName: name,
      userImage: profileImage
    })
  } catch (error) {
    console.error("Error in getStreamToken controller:", error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}