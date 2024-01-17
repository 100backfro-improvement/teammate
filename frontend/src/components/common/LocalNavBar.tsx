// import { Link } from "react-router-dom";
import { useState } from "react";
import ChatView from "../Chat/ChatView";

const LocalNavBar = ({ teamId }: any) => {
  const [chatToggle, setChatToggle] = useState(false);

  return (
    <div className="navbar justify-end bg-green-300">
      {/* <div className="flex"> */}
      <ul className="menu menu-horizontal px-1">
        <li>
          <button
            onClick={() => {
              setChatToggle(!chatToggle);
            }}
          >
            채팅
          </button>
        </li>
        <li>
          <button>알림</button>
        </li>
      </ul>
      {chatToggle && <ChatView teamId={teamId} />}
      {/* </div> */}
    </div>
  );
};

export default LocalNavBar;
