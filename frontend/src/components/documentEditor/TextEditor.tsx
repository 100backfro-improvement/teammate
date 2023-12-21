import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as StompJs from "@stomp/stompjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { accessTokenState } from "../../state/authState";

const StyledTexteditor = styled.div`
  width: 41rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 300px;
  border: 1px solid gray;
  padding: 4px;
  font-size: 16px;
`;

const TitleInput = styled.input`
  border: 1px solid black;
  background-color: white;
  color: black;
  width: 100%;
  font-size: 16px;
  margin-bottom: 4px;
  border: 1px solid gray;
  padding: 4px;
  ::placeholder {
    color: gray;
  }
`;

const StyledButton = styled.button`
  background-color: rgb(163, 204, 163);
  color: #333333;
  border-radius: 0.5rem;
  margin: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 41rem;
  margin-top: 10px;
`;

interface TextEditorProps {
  teamId: string;
  documentsId: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ teamId, documentsId }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const docsId = documentsId;
  const client = useRef<StompJs.Client | null>(null);
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${accessTokenState}`,
  };

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        const response = await axios.get(
          `/team/${teamId}/documents/${documentsId}`,
          { headers },
        );
        if (response.data) {
          setTitle(response.data.title);
          setContent(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    };

    fetchDocumentData();

    const onConnect = (trimmedDocsId: string) => {
      console.log("Connected to WebSocket with", trimmedDocsId);
      const docsMessage = {
        documentId: trimmedDocsId,
      };

      client.current!.publish({
        destination: "/app/doc.showDocs",
        body: JSON.stringify(docsMessage),
      });
      console.log("'/app/doc.showDocs'에 publish");

      client.current!.subscribe("/topic/public", (docs) => {
        displayDocs(JSON.parse(docs.body));
        console.log("docs.body : ", docs.body);
      });
    };

    client.current!.onConnect = () => {
      onConnect(docsId);
    };

    client.current!.activate();
    console.log("title content : ", title, content);

    return () => {
      client.current?.deactivate();
    };
  }, []);

  const displayDocs = (docs: any) => {
    setTitle(docs.title);
    setContent(docs.content);
    console.log(title, content);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);

    if (client.current) {
      const message = {
        text: event.target.value,
        documentId: documentsId,
      };

      client.current.publish({
        destination: "/topic/broadcastByTextChange",
        body: JSON.stringify(message),
      });
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm("문서를 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        await axios.delete(`/team/${teamId}/documents/${documentsId}`, {
          headers,
        });
        navigate(`/team/${teamId}/documentsList`);
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const handleCommentClick = () => {
    const currentPath = window.location.pathname;
    navigate(`${currentPath}/comment`);
  };

  return (
    <StyledTexteditor>
      <TitleInput
        value={title}
        onChange={handleTitleChange}
        placeholder="제목을 입력하세요"
      />
      <TextArea value={content} onChange={handleTextChange} />
      <ButtonContainer>
        <StyledButton onClick={handleCommentClick}>댓글</StyledButton>
        <StyledButton onClick={handleDelete}>삭제하기</StyledButton>
      </ButtonContainer>
    </StyledTexteditor>
  );
};

export default TextEditor;
