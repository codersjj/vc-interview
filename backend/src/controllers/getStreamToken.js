import { serverClient } from "../lib/stream.js"

export const getStreamToken = (req, res) => {
  try {
    const { 
      clerkId,
      name,
      profileImage
    } = req.user
    // use clerkId for Stream (not mongodb _id) => it should match the id we have in the Stream dashboard
    const token = serverClient.createToken(clerkId)

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