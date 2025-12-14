import { type Call, type StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Channel, StreamChat } from "stream-chat";
import { sessionApi } from "../api/sessions";
import {
  disconnectStreamVideoClient,
  initializeStreamVideoClient,
} from "../lib/stream";
import type { Session } from "../types";

const useStreamClient = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isHost: boolean,
  isParticipant: boolean
) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const [call, setCall] = useState<Call | null>(null);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall: Call | null = null;
    let chatClient: StreamChat | null = null;

    const initCall = async () => {
      console.log(
        'session?.status === "completed"',
        session?.status === "completed"
      );
      if (
        !session?.callId ||
        (!isHost && !isParticipant) ||
        session.status === "completed"
      ) {
        return;
      }

      try {
        const { token, userId, userName, userImage } =
          await sessionApi.getStreamToken();

        // To initiate chat and video clients you are encouraged to use the same API key. The user tokens should be generated with the same secret. There is no need to create separate apps for chat and video.
        // see: https://getstream.io/video/docs/react/advanced/chat-with-video/#app-boilerplate
        const videoClient = await initializeStreamVideoClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );
        setVideoClient(videoClient);
        // see:
        // https://getstream.io/video/docs/react/basics/quickstart/
        // https://getstream.io/video/docs/react/guides/joining-and-creating-calls/#create-call
        videoCall = videoClient.call("default", session.callId);
        // Join with mic and camera off
        // see: https://getstream.io/video/docs/react/guides/joining-and-creating-calls/#join-with-mic-and-camera-on-or-off
        await videoCall.camera.disable();
        await videoCall.microphone.disable();
        await videoCall.join({ create: true });
        setCall(videoCall);

        // see: https://getstream.io/chat/docs/react/
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClient = StreamChat.getInstance(apiKey);
        await chatClient.connectUser(
          { id: userId, name: userName, image: userImage },
          token
        );

        const channel = chatClient.channel("messaging", session.callId);
        await channel.watch();

        setChatClient(chatClient);
        setChannel(channel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (!isLoadingSession && session) initCall();

    // cleanup - performance reasons
    return () => {
      (async () => {
        try {
          if (videoCall) {
            await videoCall.leave();
            // .catch(() => console.error("Failed to leave the call"));
            console.log("Cleanup: Left the call");
          }
          if (chatClient) {
            await chatClient.disconnectUser();
            console.log("Cleanup: Disconnected chat client");
          }
          await disconnectStreamVideoClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [
    session?.callId,
    session?.status,
    isHost,
    isParticipant,
    isLoadingSession,
  ]);

  return {
    videoClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
};

export default useStreamClient;
