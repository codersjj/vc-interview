import { useCallback, useEffect, useRef, useState } from "react";
import {
  CallingState,
  type Call,
  type StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Channel, StreamChat } from "stream-chat";
import { sessionApi } from "../api/sessions";
import {
  disconnectStreamVideoClient,
  initializeStreamVideoClient,
} from "../lib/stream";
import type { Session } from "../types";
import toast from "react-hot-toast";

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

  // Track if the user left the call via UI to avoid double leave in cleanup
  const hasLeftCallRef = useRef(false);
  // Track if the effect is still mounted to cancel async operations
  const isMountedRef = useRef(true);
  // Store references for cleanup
  const videoCallRef = useRef<Call | null>(null);
  const chatClientRef = useRef<StreamChat | null>(null);

  // Function to properly leave the call - called by VideoUI when user clicks leave
  const handleLeaveCall = useCallback(async () => {
    hasLeftCallRef.current = true;
    try {
      if (
        videoCallRef.current &&
        videoCallRef.current.state.callingState !== CallingState.LEFT
      ) {
        await videoCallRef.current.leave();
        console.log("Left the call via UI");
      }
      if (chatClientRef.current) {
        await chatClientRef.current.disconnectUser();
        console.log("Disconnected chat client via UI");
      }
      await disconnectStreamVideoClient();

      // Clear sessionStorage marker so user can rejoin in this tab
      if (session?.callId) {
        sessionStorage.removeItem(`stream_call_joined_${session.callId}`);
      }
    } catch (error) {
      console.error("Error leaving call:", error);
    }
  }, [session?.callId]);

  useEffect(() => {
    // Reset the hasLeftCall flag when effect runs (new session or rejoin)
    hasLeftCallRef.current = false;
    // Mark as mounted
    isMountedRef.current = true;

    const initCall = async () => {
      setIsInitializingCall(true);
      if (!session || !session.callId || (!isHost && !isParticipant)) {
        setIsInitializingCall(false);
        return;
      }

      try {
        const { token, userId, userName, userImage } =
          await sessionApi.getStreamToken();

        // Check if still mounted after async operation
        if (!isMountedRef.current) {
          console.log("Component unmounted during getStreamToken, aborting");
          return;
        }

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

        // Check if still mounted after async operation
        if (!isMountedRef.current) {
          console.log(
            "Component unmounted during initializeStreamVideoClient, aborting"
          );
          await disconnectStreamVideoClient();
          return;
        }

        setVideoClient(videoClient);
        // see:
        // https://getstream.io/video/docs/react/basics/quickstart/
        // https://getstream.io/video/docs/react/guides/joining-and-creating-calls/#create-call
        const videoCall = videoClient.call("default", session.callId);
        videoCallRef.current = videoCall;

        // Check if user is already active in this call from another tab/browser
        // We use sessionStorage (tab-specific) to track if THIS tab has joined before
        const sessionKey = `stream_call_joined_${session.callId}`;
        const hasJoinedInThisTab = sessionStorage.getItem(sessionKey);

        if (!hasJoinedInThisTab) {
          // First time joining in this tab - check for existing participants
          const callState = await videoCall.get();

          // Check if still mounted after async operation
          if (!isMountedRef.current) {
            console.log("Component unmounted during videoCall.get(), aborting");
            await disconnectStreamVideoClient();
            return;
          }

          console.log(
            "callState.call?.session?.participants",
            callState.call?.session?.participants
          );
          const existingParticipant =
            callState.call?.session?.participants.find(
              (p) => p.user.id === userId
            );

          if (existingParticipant) {
            toast.error(
              "You are already active in this session from another tab!"
            );
            setIsInitializingCall(false);
            return;
          }
        }

        // Mark that this tab has joined
        sessionStorage.setItem(sessionKey, "true");

        // Join with mic and camera off
        // see: https://getstream.io/video/docs/react/guides/joining-and-creating-calls/#join-with-mic-and-camera-on-or-off
        await videoCall.camera.disable();
        await videoCall.microphone.disable();
        await videoCall.join({ create: true });

        // Check if still mounted after join - if not, we need to leave immediately
        if (!isMountedRef.current) {
          console.log(
            "Component unmounted after videoCall.join(), leaving call"
          );
          await videoCall
            .leave()
            .catch(() => console.error("Failed to leave call after unmount"));
          await disconnectStreamVideoClient();
          sessionStorage.removeItem(sessionKey);
          return;
        }

        setCall(videoCall);

        // see: https://getstream.io/chat/docs/react/
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        const chatClientInstance = StreamChat.getInstance(apiKey);
        chatClientRef.current = chatClientInstance;
        await chatClientInstance.connectUser(
          { id: userId, name: userName, image: userImage },
          token
        );

        // Check if still mounted after chat connect
        if (!isMountedRef.current) {
          console.log("Component unmounted after chat connect, cleaning up");
          await chatClientInstance.disconnectUser();
          await videoCall
            .leave()
            .catch(() => console.error("Failed to leave call after unmount"));
          await disconnectStreamVideoClient();
          sessionStorage.removeItem(sessionKey);
          return;
        }

        const channel = chatClientInstance.channel("messaging", session.callId);
        await channel.watch();

        // Final mount check
        if (!isMountedRef.current) {
          console.log("Component unmounted after channel.watch(), cleaning up");
          await chatClientInstance.disconnectUser();
          await videoCall
            .leave()
            .catch(() => console.error("Failed to leave call after unmount"));
          await disconnectStreamVideoClient();
          sessionStorage.removeItem(sessionKey);
          return;
        }

        setChatClient(chatClientInstance);
        setChannel(channel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        if (isMountedRef.current) {
          setIsInitializingCall(false);
        }
      }
    };

    if (!isLoadingSession && session) initCall();

    // cleanup - only runs when component unmounts or dependencies change
    return () => {
      // Mark as unmounted to cancel any in-progress async operations
      isMountedRef.current = false;

      // If user already left via UI (handleLeaveCall), skip cleanup
      if (hasLeftCallRef.current) {
        console.log("Cleanup skipped - user already left via UI");
        return;
      }

      // Otherwise, perform cleanup (e.g., when navigating away without clicking leave)
      (async () => {
        try {
          console.log(
            "Cleanup: videoCall?.state.callingState",
            videoCallRef.current?.state.callingState
          );
          if (
            videoCallRef.current &&
            videoCallRef.current.state.callingState !== CallingState.LEFT
          ) {
            await videoCallRef.current
              .leave()
              .catch(() => console.error("Failed to leave the call"));
            console.log("Cleanup: Left the call");
          }
          if (chatClientRef.current) {
            await chatClientRef.current.disconnectUser();
            console.log("Cleanup: Disconnected chat client");
          }
          await disconnectStreamVideoClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, isHost, isParticipant, isLoadingSession]);

  return {
    videoClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
    handleLeaveCall,
  };
};

export default useStreamClient;
