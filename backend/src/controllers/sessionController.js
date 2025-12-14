import Session from "../models/Session.js";
import {
  addMemberToChannel,
  createChatChannel,
  createVideoCall,
  deleteChatChannel,
  deleteVideoCall,
} from "../lib/stream.js";

export const createSession = async (req, res) => {
  try {
    const { problem, difficulty } = req.body;
    console.log(
      "🚀 ~ createSession ~ problem, difficulty:",
      problem,
      difficulty
    );

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and difficulty are required" });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const { _id: userId, clerkId } = req.user;

    // generate a unique call ID for stream video
    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .slice(7)}`;

    // create session document
    // see: https://mongoosejs.com/docs/models.html#constructing-documents
    const session = new Session({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // create stream resources and save to DB with proper rollback handling
    // ensures transaction consistency across Stream and MongoDB
    try {
      // Step 1: Create video call
      await createVideoCall("default", callId, clerkId, {
        problem,
        difficulty,
        sessionId: session._id.toString(),
      });

      // Step 2: Create chat channel
      try {
        await createChatChannel(
          "messaging",
          callId,
          clerkId,
          `${problem} Session`,
          [clerkId]
        );
      } catch (chatError) {
        // Rollback video call if chat channel creation failed
        try {
          await deleteVideoCall("default", callId, true);
          console.log(
            "Rolled back video call due to chat channel creation failure"
          );
        } catch (rollbackError) {
          console.error("Failed to rollback video call:", rollbackError);
        }
        throw chatError;
      }

      // Step 3: Save session to database
      try {
        await session.save();
        console.log("Session created with ID:", session._id);
      } catch (dbError) {
        // Rollback both Stream resources if DB save failed
        try {
          await Promise.all([
            deleteChatChannel("messaging", callId),
            deleteVideoCall("default", callId, true),
          ]);
          console.log(
            "Rolled back Stream resources due to database save failure"
          );
        } catch (rollbackError) {
          console.error("Failed to rollback Stream resources:", rollbackError);
        }
        throw dbError;
      }
    } catch (error) {
      // Re-throw to be caught by outer catch block
      throw error;
    }

    res.status(201).json({ session });
  } catch (error) {
    console.error("Error in createSession controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActiveSessions = async (_, res) => {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getActiveSessions controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyRecentSessions = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }
    const { _id: userId } = req.user;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getMyRecentSessions controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error in getSessionById controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinSession = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }
    const { _id: userId, clerkId } = req.user;

    const { id } = req.params;
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot join a session that is not active" });
    }

    if (session.host.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Host cannot join their own session as participant" });
    }

    // Atomically update only if participant is not set (prevents race condition)
    // see: https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    const updatedSession = await Session.findOneAndUpdate(
      { _id: id, participant: null, status: "active", host: { $ne: userId } },
      { participant: userId },
      { new: true }
    );

    if (!updatedSession) {
      return res
        .status(409)
        .json({ message: "Session is already full or unavailable" });
    }

    await addMemberToChannel("messaging", updatedSession.callId, clerkId);

    console.log(`User ${userId} joined session ${id}`);
    res.status(200).json({ session: updatedSession });
  } catch (error) {
    console.error("Error in joinSession controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const endSession = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }
    const { _id: userId } = req.user;

    const { id } = req.params;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // check if requester is the host
    if (session.host.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream chat channel
    await deleteChatChannel("messaging", session.callId);

    // delete stream video call
    await deleteVideoCall("default", session.callId, true);

    session.status = "completed";
    await session.save();

    console.log(`Session ${id} ended by host ${userId}`);
    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.error("Error in endSession controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// https://www.npmjs.com/package/express-async-handler
