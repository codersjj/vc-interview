import {
  StreamCall,
  StreamVideo,
  type Call,
  type StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, PhoneOffIcon } from "lucide-react";
import type { Channel, StreamChat } from "stream-chat";
import VideoUI from "./VideoUI";

interface VideoCallAndChatProps {
  call: Call | null;
  channel: Channel | null;
  chatClient: StreamChat | null;
  isInitializingCall: boolean;
  videoClient: StreamVideoClient | null;
  onLeaveCall: () => Promise<void>;
}

const VideoCallAndChat = ({
  call,
  channel,
  chatClient,
  isInitializingCall,
  videoClient,
  onLeaveCall,
}: VideoCallAndChatProps) => {
  return (
    <div className="p-4 h-full bg-base-100 overflow-auto">
      {isInitializingCall ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <Loader2Icon className="mb-4 mx-auto size-12 text-primary animate-spin" />
            <p className="text-lg">Connecting to video call...</p>
          </div>
        </div>
      ) : !videoClient || !chatClient || !call || !channel ? (
        <div className="flex justify-center items-center h-full">
          <div className="card max-w-md bg-base-100 shadow-xl">
            <div className="card-body flex items-center text-center">
              <div className="flex justify-center items-center size-24 bg-error/10 rounded-full">
                <PhoneOffIcon className="size-12 text-error" />
              </div>
              <h2 className="card-title text-2xl">Connection Failed</h2>
              <p className="text-base-content/70">
                Unable to connect to the video call
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <StreamVideo client={videoClient}>
            <StreamCall call={call || undefined}>
              <VideoUI
                chatClient={chatClient}
                channel={channel}
                onLeaveCall={onLeaveCall}
              />
            </StreamCall>
          </StreamVideo>
        </div>
      )}
    </div>
  );
};

export default VideoCallAndChat;
