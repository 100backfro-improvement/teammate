import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { accessTokenState } from "../../state/authState";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios.tsx";

interface TeamAlarmProps {}

const TeamAlarm: React.FC<TeamAlarmProps> = () => {
  const [alarms, setAlarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useRecoilValue(accessTokenState);

  const { teamId } = useParams<{ teamId: string }>();
  useEffect(() => {
    const fetchTeamAlarms = async () => {
      try {
        setLoading(true);

        // 개인 알람 데이터 가져오기
        const personalAlarms = await axiosInstance.get("/notification/member/");
        const personalAlarmData = personalAlarms.data.content.map(
          (item: any) => ({
            content: item.message,
            date: item.createDt,
          }),
        );

        // 팀 알람 데이터 가져오기
        if (teamId != null) {
          const teamAlarms = await axiosInstance.get(
            "/notification/team/" + teamId,
          );
          const teamAlarmData = teamAlarms.data.content.map((item: any) => ({
            content: item.message,
            date: item.createDt,
          }));

          // 개인 알람과 팀 알람을 합쳐서 설정
          setAlarms([...personalAlarmData, ...teamAlarmData]);
        } else {
          setAlarms(personalAlarmData);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching alarms:", error);
      }
    };

    fetchTeamAlarms();
  }, [accessToken, teamId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {alarms.length === 0 ? (
        <NoAlarmsMessage>알림이 없습니다.</NoAlarmsMessage>
      ) : (
        alarms.map((alarm, index) => (
          <AlarmContainer key={index}>
            <AlarmContent>{alarm.content}</AlarmContent>
            <DateInfo>
              {new Date(alarm.date).toLocaleDateString("ko-KR")}
            </DateInfo>
          </AlarmContainer>
        ))
      )}
    </div>
  );
};

export default TeamAlarm;

const AlarmContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
  border-radius: 5px;
  &:hover {
    background-color: #f5f6f7;
  }
`;

const AlarmContent = styled.div`
  color: black;
`;

const DateInfo = styled.div`
  color: #888;
  font-size: 12px;
`;

const NoAlarmsMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 16px;
  margin-bottom: 10px;
`;
