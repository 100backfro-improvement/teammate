import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../axios.tsx";

interface PersonalAlarmProps {}

const PersonalAlarm: React.FC<PersonalAlarmProps> = () => {
  const [alarmData, setAlarmData] = useState<
    Array<{ message: string; createDt: string }>
  >([]);

  useEffect(() => {
    axiosInstance
      .get("/notification/member/")
      .then((response) => {
        console.log(response.data.content);
        if (
          Array.isArray(response.data.content) &&
          response.data.content.length > 0
        ) {
          const alarms = response.data.content.map((item: any) => ({
            message: item.message,
            createDt: item.createDt,
          }));

          const sortedAlarms = alarms.sort(
            (a: any, b: any) =>
              new Date(b.createDt).getTime() - new Date(a.createDt).getTime(),
          );
          setAlarmData(sortedAlarms);
        } else {
          console.error("팀 알람 데이터가 비어 있거나 형식이 맞지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("팀 알람 데이터를 불러오는 중 에러 발생:", error);
      });
  }, []);

  return (
    <>
      {alarmData.map((alarm, index) => (
        <AlarmContainer key={index}>
          <AlarmContent>{alarm.message}</AlarmContent>
          <DateInfo>
            {new Date(alarm.createDt).toLocaleDateString("ko-KR")}
          </DateInfo>
        </AlarmContainer>
      ))}
    </>
  );
};

export default PersonalAlarm;

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
