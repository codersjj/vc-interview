import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel as ChatChannelType, StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

interface VideoUIProps {
  chatClient: StreamChat | null;
  channel: ChatChannelType | null;
  onLeaveCall: () => Promise<void>;
}

const VideoUI = ({ chatClient, channel, onLeaveCall }: VideoUIProps) => {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <Loader2Icon className="mx-auto mb-4 size-12 text-primary animate-spin" />
          <p className="text-lg">Joining...</p>
        </div>
      </div>
    );
  }

  return (
    // add str-video class or use StreamTheme component, see:
    // https://getstream.io/video/docs/react/advanced/chat-with-video/#adding-default-styles
    // https://getstream.io/video/docs/react/ui-components/overview/#theming-with-css
    <div className="flex gap-3 h-full str-video">
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Participants count badge and Chat Toggle */}
        <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              {participantCount}{" "}
              {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-sm gap-2 ${
                isChatOpen ? "btn-primary" : "btn-ghost"
              }`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="size-4" />
              Chat
            </button>
          )}
        </div>

        <div className="flex-1 bg-base-300 rounded-xl overflow-hidden">
          <SpeakerLayout />
        </div>
        <div className="flex justify-center items-center p-3 bg-base-200 rounded-xl shadow">
          <CallControls
            onLeave={async () => {
              // First properly cleanup via our handler, then navigate
              await onLeaveCall();
              navigate("/dashboard");
            }}
          />
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col h-full bg-[#272a30] rounded-lg shadow overflow-hidden transition-all duration-300 ease-in-out ${
            isChatOpen ? "min-w-50 w-80 opacity-100" : "w-0 opacity-0"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="flex justify-between items-center p-3 bg-[#1c1e22] border-b border-[#3a3d44]">
                <h3 className="text-white font-semibold">Session Chat</h3>
                <button
                  title="Close chat"
                  className="text-gray-400 rotate-0 hover:text-white hover:rotate-180 transition-[color,rotate] duration-300"
                  onClick={() => setIsChatOpen(false)}
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {/* set theme, see: https://getstream.io/chat/docs/sdk/react/theming/themingv2/#dark-and-light-themes */}
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <ChannelHeader />
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUI;
