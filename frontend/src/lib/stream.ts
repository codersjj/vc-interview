import { StreamVideoClient, type User } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let client: StreamVideoClient | null = null;

export const initializeStreamVideoClient = async (
  user: User,
  token: string
) => {
  console.log("client", client);
  // console.log("client?.user?.id", client?.user?.id);
  console.log(
    "client?.state.connectedUser?.id",
    client?.state.connectedUser?.id
  );
  // if client exists with the same user, instead of creating again, just return it
  if (client && client.state.connectedUser?.id === user.id) {
    console.log("client exists with the same user");
    return client;
  }

  // disconnect the client if it exists
  if (client) {
    await disconnectStreamVideoClient();
  }

  if (!apiKey) throw new Error("Stream API key is not provided!");

  client = new StreamVideoClient({ apiKey, user, token });
  console.log("Connected Stream client");

  return client;
};

export const disconnectStreamVideoClient = async () => {
  if (client) {
    try {
      await client.disconnectUser();
      client = null;
      console.log("Disconnected Stream client");
    } catch (error) {
      console.error("Error disconnecting Stream client:", error);
    }
  }
};
