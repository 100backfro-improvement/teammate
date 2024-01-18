import { useState, useEffect } from "react";
import ChatView from "../Chat/ChatView";

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
          <button>알림</button>
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
