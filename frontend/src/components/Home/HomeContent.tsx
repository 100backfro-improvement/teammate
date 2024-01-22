import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  searchState,
  userTeamsState,
  accessTokenState,
  isAuthenticatedState,
} from "../../state/authState";
import { Team } from "../../interface/interface.ts";

const ITEMS_PER_PAGE = 6;

interface PageNumberProps {
  isSelected: boolean;
}

const HomeContent = () => {
  const [userTeams, setUserTeams] = useRecoilState<Team[]>(userTeamsState);
  const search = useRecoilValue(searchState);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useRecoilValue(accessTokenState);
  const navigate = useNavigate();
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        if (!isAuthenticated) {
          navigate("/signIn");
          return;
        }
        const teamListResponse = await axiosInstance.get("/team/list");
        setUserTeams(teamListResponse.data);
        window.sessionStorage.setItem(
          `teamList_${accessToken}`,
          JSON.stringify(teamListResponse.data),
        );
      } catch (error: any) {
        console.error("Error fetching team list:", error);
        setError(error.message || "An error occurred");
      }
    };

    fetchLoggedInUserId();
  }, [accessToken, setUserTeams, isAuthenticated]);

  if (error) {
    return <div>{error}</div>;
  }

  // userTeams가 배열이 아닌 경우에 대한 처리
  if (!Array.isArray(userTeams)) {
    return null;
  }

  const filteredTeamList = userTeams
    .filter((team) => team.name.toLowerCase().includes(search.toLowerCase()))
    .filter((team) => {
      return (
        team.restorationDt === null ||
        team.teamRole === "LEADER" ||
        (team.teamRole === "MATE" && team.restorationDt === null)
      );
    });

  const indexOfLastTeam = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstTeam = indexOfLastTeam - ITEMS_PER_PAGE;
  const currentTeams = filteredTeamList.slice(
    indexOfFirstTeam,
    indexOfLastTeam,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRestoration = async (teamId: number) => {
    try {
      await axiosInstance.patch(`/team/${teamId}/restore?restoreDt=2023-01-01`);
      const updatedTeamList = await axiosInstance.get("/team/list");
      setUserTeams(updatedTeamList.data);
      alert("복구가 완료되었습니다.");
    } catch (error: any) {
      console.error("팀 복구 중 에러 발생:", error);
    }
  };

  return (
    <>
      <TeamListContainer>
        {currentTeams.map((team, index) => (
          <TeamItem key={index}>
            <TeamCard
              onClick={() => {
                if (team.restorationDt !== null) {
                  return;
                }
                navigate(`/team/${team.teamId}`, {
                  state: { team },
                });
              }}
            >
              <TeamContent>
                {team.profileUrl && (
                  <TeamImage
                    src={team.profileUrl}
                    alt={`${team.name} 이미지`}
                  />
                )}
                <TeamName>{team.name}</TeamName>
              </TeamContent>
              {team.restorationDt !== null ? (
                <Button onClick={() => handleRestoration(team.teamId)}>
                  복구하기
                </Button>
              ) : (
                <Button>참여하기</Button>
              )}
            </TeamCard>
          </TeamItem>
        ))}
      </TeamListContainer>
      <Pagination>
        {Array.from({
          length: Math.ceil(filteredTeamList.length / ITEMS_PER_PAGE),
        }).map((_, index) => (
          <PageNumber
            key={index}
            onClick={() => paginate(index + 1)}
            isSelected={index + 1 === currentPage}
          >
            {index + 1}
          </PageNumber>
        ))}
      </Pagination>
    </>
  );
};

export default HomeContent;

const TeamListContainer = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 16px;
  padding: 8px;
  margin-top: 24px;
  width: 900px;
`;

const TeamItem = styled.li`
  list-style: none;
  margin-bottom: 16px;
`;

const TeamCard = styled.div`
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 12px;
  transition: transform 0.2s ease-in-out;
  height: 150px;
  width: 250px;

  &:hover {
    transform: scale(1.05);
    color: #5dd68e;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
  }
`;

const TeamContent = styled.div`
  display: flex;
  align-items: center;
`;

const TeamName = styled.h3`
  margin: 16px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const TeamImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  margin: 16px;
  object-fit: cover;
`;

const Pagination = styled.div`
  display: flex;
  margin-top: 400px;
  justify-content: center;
  width: 100%;
  height: 30px;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const PageNumber = styled.div<PageNumberProps>`
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#333333")};
  background-color: ${({ isSelected }) =>
    isSelected ? "#5DD68E" : "transparent"};

  border-radius: 50px;
  text-align: center;
  padding: 4px;

  &:hover {
    background-color: #5dd68e;
  }
`;

const Button = styled.span`
  color: #555555;
  border: 1px solid #cccccc;
  width: 90%;
  padding: 6px 12px;
  text-align: center;
  margin: 0 auto;
  cursor: ${({ children }) =>
    children === "복구하기" ? "pointer" : "default"};
  color: ${({ children }) => (children === "복구하기" ? "red" : "#555555")};
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: ${({ children }) =>
      children === "참여하기" ? "#5dd68e" : "red"};
    color: white;
  }

  @media (max-width: 600px) {
    order: -1;
  }
`;
