import styled from "styled-components";
import emailImg from "../../assets/email.png";
import { useNavigate } from "react-router-dom";

export default function EmailSend() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/signIn");
  };
  return (
    <StyledContainer>
      <Img src={emailImg} alt="email" />
      <StyledTitle>환영합니다! 이메일 주소를 인증해 주세요.</StyledTitle>
      <StyledText>이메일 인증을 위한 메일이 발송되었습니다.</StyledText>
      <StyledText>회원가입 완료를 위한 이메일 인증을 진행해 주세요.</StyledText>
      <StyledButton onClick={handleLoginClick}>로그인</StyledButton>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

const Img = styled.img`
  width: 200px;
  height: auto;
`;

const StyledTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-top: 60px;
  margin-bottom: 20px;
  color: #333333;
`;

const StyledText = styled.p`
  margin-top: 10px;
`;

const StyledButton = styled.button`
  margin-top: 60px;
  padding: 8px 80px;
  background-color: #5DD68E;
  color: #333333;
  cursor: pointer;
  textAlign: "center",
  &:hover {
    background-color: #cccccc;
  }
`;
