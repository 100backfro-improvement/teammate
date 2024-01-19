import { Link } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../../axios";
import { useState, useEffect } from "react";

export default function HomeCreateTeamBtn() {
  const [teamListLength, setTeamListLength] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/team/list");
        setTeamListLength(response.data.length);
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    };

    fetchData();
  }, []);
  //
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
              alert("존재하지 않는 초대코드입니다.");
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

  return (
    <>
      <CenteredContainer>
        <TeamInfo>
          팀<TeamCount>{teamListLength}</TeamCount>
        </TeamInfo>
        <TeamInviteContainer>
          <TeamInvite>
            <input
              type="text"
              placeholder="초대코드를 입력하세요"
              value={inviteCode}
              onChange={handleInputInviteCode}
            />
          </TeamInvite>
          <CreateTeamButton onClick={handleCreateTeam}>참가</CreateTeamButton>
        </TeamInviteContainer>
        <Link to="/teamInfo">
          <CreateTeamButton>팀 만들기</CreateTeamButton>
        </Link>
      </CenteredContainer>
    </>
  );
}

const CenteredContainer = styled.div`
  margin: 25px 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const TeamInfo = styled.span`
  color: #333333;
  font-size: 25px;
  display: flex;
  align-items: center;
`;

const TeamCount = styled.span`
  margin-left: 4px;
  font-size: 20px;
  color: #555555;
  margin-right: 400px;
`;

const TeamInvite = styled.span`
  position: relative;
  padding: 5px;
  margin-right: 10px;
  margin-left: 5px;
  @media (max-width: 600px) {
    margin-top: 10px;
  }

  input {
    outline: none;
    border: none;
    width: 130px;
    font-size: 14px;
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

const TeamInviteContainer = styled.span`
  padding: 6px;
  border-radius: 8px;
`;

const CreateTeamButton = styled.button`
  padding: 8px 16px;
  margin-right: 15px;
  background-color: #5dd68e;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #cccccc;
  }
  @media (max-width: 600px) {
    margin-top: 10px;
  }
`;
