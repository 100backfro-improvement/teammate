import { useState, useEffect } from "react";
import ChatView from "../Chat/ChatView";
import AlarmModal from "../alarm/TeamAlarmModal";

// import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import axiosInstance from "../../axios";

const LocalNavBar = ({ teamId }: any) => {
  // 채팅화면 토글
  const [chatToggle, setChatToggle] = useState(false);

  // 채팅 통신유지 여부 토글
  //   const [sseEnabled, setSSEEnabled] = useState(false);

  //   const accessToken = window.sessionStorage.getItem("accessToken");
  //   const EventSource = EventSourcePolyfill || NativeEventSource;

  // 현재 페이지의 사용자 팀 멤버 Id(participant)
  const [myTeamMemberId, setMyTeamMemberId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchMyTeamMemberId = async () => {
      try {
        // 사용자가 속해있는 팀 목록과 닉네임등의 정보를 불러옴
        const response = await axiosInstance.get("/member/participants", {});
        // 사용자가 가입한 팀 목록중에 현재 팀id의 정보와 맞는 팀 내 내정보 값만 가져옴
        const myTeamMemberInfo = response.data.find(
          (item: { teamId: number }) => item.teamId === Number(teamId),
        );
        const authorTeamMemberId = myTeamMemberInfo.teamParticipantsId;
        setMyTeamMemberId(authorTeamMemberId);
        // console.log("작성자 팀멤버 아이디 -> ",myTeamMemberId);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchMyTeamMemberId();
  }, [teamId]);

  const handleChatToggle = () => {
    setChatToggle(!chatToggle);
  };

  //알람모달
  const [isModalOpen, setModalOpen] = useState(false);

  const handleNotificationClick = () => {
    setModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="navbar justify-end bg-green-300">
      {/* <div className="flex"> */}
      <ul className="menu menu-horizontal px-1">
        <li>
          <button
            onClick={() => {
              handleChatToggle();
            }}
          >
            채팅
          </button>
        </li>
        <li>
          <button
            className="btn btn-ghost btn-circle"
            onClick={handleNotificationClick}
            aria-label="알림 보기"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* <span className="badge badge-xs badge-primary indicator-item"></span> */}
            </div>
          </button>
          {isModalOpen && <AlarmModal closeModal={closeModal} />}{" "}
        </li>
      </ul>
      {chatToggle && (
        <ChatView teamId={teamId} myTeamMemberId={myTeamMemberId} />
      )}
      {/* </div> */}
    </div>
  );
};

export default LocalNavBar;
