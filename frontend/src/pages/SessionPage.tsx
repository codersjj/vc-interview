import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate, useParams } from "react-router";
import NavBar from "../components/NavBar";
import { PROBLEMS } from "../data/problems";
import useCodeRunning from "../hooks/useCodeRunning";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "../hooks/useSessions";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import useStreamClient from "../hooks/useStreamClient";
import VideoCallAndChat from "../components/VideoCallAndChat";

const SessionPage = () => {
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  const { isLoaded: isUserLoaded, user } = useUser();

  const {
    isPending: isSessionPending,
    data: sessionData,
    refetch: refetchSession,
  } = useSessionById(sessionId!);

  const { mutate: joinSessionMutate } = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  // find the problem data based on session problem title
  const problem = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const {
    selectedLanguage,
    code,
    isRunning,
    output,
    setCode,
    handleLanguageChange,
    handleRunCode,
  } = useCodeRunning(problem);

  const {
    call,
    channel,
    chatClient,
    isInitializingCall,
    videoClient,
    handleLeaveCall,
  } = useStreamClient(session, isSessionPending, isHost, isParticipant);

  // redirect the participant when session ends
  useEffect(() => {
    if (isSessionPending || !session) return;
    if (session?.status === "completed") {
      navigate("/dashboard");
    }
  }, [isSessionPending, session, navigate]);

  // auto-join the session if user is not already a participant and not the host
  useEffect(() => {
    if (!isUserLoaded || !user || isSessionPending || !session) return;
    if (isHost || isParticipant) return;
    joinSessionMutate(sessionId!, {
      onSuccess: () => {
        refetchSession();
      },
    });
  }, [
    isUserLoaded,
    user,
    isSessionPending,
    session,
    isHost,
    isParticipant,
    sessionId,
    // Disallow putting the result of query hooks directly in a React hook dependency array
    // see: https://tanstack.com/query/latest/docs/eslint/no-unstable-deps
    joinSessionMutate,
    refetchSession,
  ]);

  // only the host can end the session
  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified."
      )
    ) {
      endSessionMutation.mutate(sessionId!, {
        // this will navigate the host to dashboard
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-base-100">
      <NavBar />
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - PROBLEM DETAILS & CODE EDITOR */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DESCRIPTION PANEL */}
              <Panel defaultSize={30} minSize={10}>
                <ProblemDescription
                  problem={problem}
                  session={session}
                  isHost={isHost}
                  isShowProblemSelector={false}
                  isLoading={isSessionPending}
                  endSessionMutation={endSessionMutation}
                  handleEndSession={handleEndSession}
                />
              </Panel>
              <PanelResizeHandle className="h-2 bg-base-300 transition-colors hover:bg-primary/60 cursor-row-resize!" />
              {/* CODE EDITOR & OUTPUT */}
              <Panel defaultSize={70} minSize={20}>
                <PanelGroup direction="vertical">
                  {/* CODE EDITOR */}
                  <Panel defaultSize={70} minSize={20}>
                    <CodeEditor
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={setCode}
                      onRunCode={handleRunCode}
                    />
                  </Panel>
                  <PanelResizeHandle className="h-2 bg-base-300 transition-colors hover:bg-primary/60 cursor-row-resize!" />
                  {/* OUTPUT PANEL */}
                  <Panel defaultSize={30} minSize={10}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 transition-colors hover:bg-primary/60 cursor-col-resize!" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <VideoCallAndChat
              call={call}
              channel={channel}
              chatClient={chatClient}
              isInitializingCall={isInitializingCall}
              videoClient={videoClient}
              onLeaveCall={handleLeaveCall}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default SessionPage;
