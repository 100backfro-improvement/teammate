import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import axiosInstance from "../../axios";
import AlarmModal from "../alarm/PersonalAlarmModal";

export default function HomeCreateTeamBtn() {
  const [inviteCode, setInviteCode] = useState("");

  const handleInputInviteCode = (event: any) => {
    setInviteCode(event.target.value);
  };

  const handleCreateTeam = () => {
    if (!inviteCode) {
      alert("초대 코드를 입력하세요.");
      return;
    }
    axiosInstance
      .get(`/team/${inviteCode}`)
      .then(() => {
        alert("팀에 참가되었습니다.");
        window.location.reload();
      })
      .catch((error) => {
        console.error("API call error:", error);
        if (error.response) {
          switch (error.response.status) {
            case 401:
              alert("토큰 값이 유효하지 않습니다.");
              break;
            case 404:
              alert("팀이 해체되었습니다.");
              break;
            case 409:
              alert("팀에 이미 참가한 경우입니다.");
              break;
            case 422:
              alert("회원이 존재하지 않습니다.");
              break;
            case 429:
              alert("팀 인원 제한에 걸렸습니다.");
              break;
            default:
              alert("API 호출 중 오류가 발생했습니다.");
              break;
          }
        } else {
          alert("이미 참가된 팀입니다.");
        }
      });
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
    <>
      <CenteredContainer>
        <Link to="/teamInfo">
          <CreateTeamButton>+ 팀 생성하기</CreateTeamButton>
        </Link>
        <TeamInvite>
          <input
            type="text"
            placeholder="초대코드를 입력하세요"
            value={inviteCode}
            onChange={handleInputInviteCode}
          />
        </TeamInvite>
        <CreateTeamButton onClick={handleCreateTeam}>참가</CreateTeamButton>
        <ul className="menu menu-horizontal px-1">
          <li>
            <AlarmButton
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
            </AlarmButton>
            {isModalOpen && <AlarmModal closeModal={closeModal} />}{" "}
          </li>
        </ul>
      </CenteredContainer>
    </>
  );
}

const CenteredContainer = styled.div`
  margin: 20px 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CreateTeamButton = styled.button`
  padding: 8px 16px;
  background-color: #5dd68e;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #cccccc;
  }
  @media (max-width: 600px) {
    margin-top: 10px;
  }
`;

const TeamInvite = styled.span`
  position: relative;
  padding: 5px;
  margin-right: 5px;
  margin-left: 30px;
  @media (max-width: 600px) {
    margin-top: 10px;
  }

  input {
    outline: none;
    border: none;
    width: 150px;
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: #cccccc;
  }
`;

const AlarmButton = styled.button`
  margin-left: 65px;
  margin-right: 100px;
  padding: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }

  svg {
    width: 30px;
    height: auto;
    stroke: #555555;
  }
`;
