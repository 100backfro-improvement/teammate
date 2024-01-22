import React, { useState } from "react";
import styled from "styled-components";
import PersonalAlarm from "./PersonalAlarm";

interface AlarmModalProps {
  closeModal: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState<"personal">("personal");

  const switchTab = (tab: "personal") => {
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
            onClick={() => switchTab("personal")}
            active={activeTab === "personal" ? "true" : "false"}
          >
            개인 알람
          </TabButton>
        </TabButtons>
        {activeTab === "personal" && <PersonalAlarm />}
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
