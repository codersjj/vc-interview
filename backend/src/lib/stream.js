import { StreamChat } from 'stream-chat';

import { ENV } from './env.js';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error('Stream API key or Stream API secret is missing');
}

// see: https://getstream.io/chat/docs/node/
export const serverClient = StreamChat.getInstance(apiKey, apiSecret);

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

// todo: add another method to generate token
