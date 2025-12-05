import { StreamChat } from 'stream-chat';

import { ENV } from './env.js';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error('Stream API key or Stream API secret is missing');
}

// see: https://getstream.io/chat/docs/node/
// Keep serverClient internal - only expose controlled operations
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async userData => {
  try {
    await serverClient.upsertUsers([userData]);
    return userData
  } catch (error) {
    console.error('Error upserting Stream user:', error);
  }
}

export const deleteStreamUser = async userId => {
  try {
    await serverClient.deleteUser(userId)
    console.log('Stream user deleted successfully:', userId)
  } catch (error) {
    console.error('Error deleting Stream user:', error);
  }
}

export const createUserToken = (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required to create token');
    }
    return serverClient.createToken(userId);
  } catch (error) {
    console.error('Error creating Stream token:', error);
    throw error;
  }
}

// todo: add another method to generate token
