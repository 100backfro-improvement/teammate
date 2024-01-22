import React, { useState } from "react";
import styled from "styled-components";
import TeamAlarm from "./TeamAlarm";

interface AlarmModalProps {
  closeModal: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState<"team">("team");

  const switchTab = (tab: "team") => {
    setActiveTab(tab);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <ModalContent onClick={handleModalClick}>
        <TabButtons>
          <TabButton
            onClick={() => switchTab("team")}
            active={activeTab === "team" ? "true" : "false"}
          >
            팀 알람
          </TabButton>
        </TabButtons>
        {activeTab === "team" && <TeamAlarm />}
      </ModalContent>
    </ModalOverlay>
  );
};

export default AlarmModal;

const ModalOverlay = styled.div`
  position: absolute;
  top: 40px;
  right: -20px;
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 360px;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TabButtons = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const TabButton = styled.button<{ active: string }>`
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  font-weight: bold;
  color: ${(props: { active: string }) =>
    props.active === "true" ? "#5dd68e" : "black"};

  &:hover {
    text-decoration: underline;
  }
`;
