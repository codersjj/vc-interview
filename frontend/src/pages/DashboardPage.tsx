import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import NavBar from "../components/NavBar";
import {
  useActiveSessions,
  useCreateSession,
  useMyRecentSessions,
} from "../hooks/useSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import type { Session } from "../types";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const { isPending: isActiveSessionsPending, data: activeSessionsData } =
    useActiveSessions();

  const activeSessions = activeSessionsData?.sessions || [];
  console.log("🚀 ~ DashboardPage ~ activeSessions:", activeSessions);

  const { isPending: isMyRecentSessionsPending, data: myRecentSessionsData } =
    useMyRecentSessions();

  const myRecentSessions = myRecentSessionsData?.sessions || [];

  const handleCreateRoom = () => {
    if (!roomConfig || !roomConfig.problem || !roomConfig.difficulty) {
      return;
    }
    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        // match difficulty to backend enum (enum: ['easy', 'medium', 'hard'])
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setIsShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const isUserInSession = (session: Session) => {
    const userId = user?.id;
    if (!userId) return false;
    return (
      session.host?.clerkId === userId ||
      session.participant?.clerkId === userId
    );
  };

  return (
    <>
      <div className="min-h-screen bg-base-100">
        <NavBar />
        <WelcomeSection onCreateSession={() => setIsShowCreateModal(true)} />
        {/* Grid layout */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionCount={activeSessions.length}
              recentSessionCount={myRecentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={isActiveSessionsPending}
              isUserInSession={isUserInSession}
            />
          </div>
          <RecentSessions
            sessions={myRecentSessions}
            isLoading={isMyRecentSessionsPending}
          />
        </div>
      </div>
      <CreateSessionModal
        isOpen={isShowCreateModal}
        onClose={() => setIsShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
};

export default DashboardPage;
