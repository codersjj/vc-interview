import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";

import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Stream API secret is missing");
}

// see: https://getstream.io/chat/docs/node/
// Keep chatClient internal - only expose controlled operations
// will be used for chat messaging
const chatClient = StreamChat.getInstance(apiKey, apiSecret, {
  timeout: 20000,
});
// will be used for video calls
const streamClient = new StreamClient(apiKey, apiSecret, { timeout: 20000 });

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};

export const createUserToken = (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to create token");
    }
    return chatClient.createToken(userId);
  } catch (error) {
    console.error("Error creating Stream token:", error);
    throw error;
  }
};

export const createVideoCall = async (
  callType,
  callId,
  createdById,
  customData
) => {
  try {
    if (!callType || !callId || !createdById) {
      throw new Error("callType, callId, and createdById are required");
    }
    const call = streamClient.video.call(callType, callId);
    await call.getOrCreate({
      data: {
        created_by_id: createdById,
        custom: {
          ...customData,
        },
      },
    });
    console.log("Video call created or retrieved:", callId);
    return call;
  } catch (error) {
    console.error("Error creating video call:", error);
    throw error;
  }
};

export const createChatChannel = async (
  channelType,
  channelId,
  createdById,
  name,
  members
) => {
  try {
    if (!channelType || !channelId || !createdById) {
      throw new Error("channelType, channelId, and createdById are required");
    }
    const channel = chatClient.channel(channelType, channelId, {
      created_by_id: createdById,
      name,
      members,
    });
    await channel.create();
    console.log("Chat channel created:", channelId);
    return channel;
  } catch (error) {
    console.error("Error creating chat channel:", error);
    throw error;
  }
};

export const addMemberToChannel = async (channelType, channelId, userId) => {
  try {
    if (!channelType || !channelId || !userId) {
      throw new Error("channelType, channelId, and userId are required");
    }
    const channel = chatClient.channel(channelType, channelId);
    await channel.addMembers([userId]);
    console.log(`User ${userId} added to channel ${channelId}`);
  } catch (error) {
    console.error("Error adding member to channel:", error);
    throw error;
  }
};

export const deleteChatChannel = async (channelType, channelId) => {
  try {
    if (!channelType || !channelId) {
      throw new Error("channelType and channelId are required");
    }
    const channel = chatClient.channel(channelType, channelId);
    const destroy = await channel.delete();
    console.log("Chat channel deleted:", channelId);
    return destroy;
  } catch (error) {
    console.error("Error deleting chat channel:", error);
    throw error;
  }
};

export const deleteVideoCall = async (callType, callId, hard) => {
  try {
    if (!callType || !callId) {
      throw new Error("callType and callId are required");
    }
    const call = streamClient.video.call(callType, callId);
    const resp = await call.delete({ hard });
    console.log("Video call deleted:", callId);
    return resp;
  } catch (error) {
    console.error("Error deleting video call:", error);
    throw error;
  }
};
