import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  DraftEditorCommand,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import styled from "styled-components";
import './TextEditor.css';

const TitleInput = styled.input`
  border: 1px solid black;
  background-color: white;
  color: black;
  width: 40rem;
  font-size: 16px;
  margin-bottom: 4px;
  padding: 4px;
  placeholder: 'title';
`

const StyledTexteditor = styled.div`
  width: 40rem;
`;

const StyledButton = styled.button`
  border : 1px solid white;
  background-color: rgb(163,204,163);
  padding: 0.5rem 1.5rem;
  color: #333333;
`;

const SaveButton = styled.button`
  background-color: rgb(163,204,163);
  color: #333333;
  border-radius: 0.5rem;
`;

const ButtonContainer = styled.div`
  width: 40rem;
`;

const TEXT_EDITOR_ITEM = "draft-js-example-item";

const TextEditor: React.FC = () => {
  const [currentText, setCurrentText] = React.useState<string>("");

  const data = localStorage.getItem(TEXT_EDITOR_ITEM);
  const initialState = data
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(data)))
    : EditorState.createEmpty();
  const [editorState, setEditorState] = React.useState<EditorState>(initialState);

  const handleSave = () => {
    const data = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    localStorage.setItem(TEXT_EDITOR_ITEM, data);
  };

  const handleChange = (newEditorState: EditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const text = contentState.getPlainText();
    setCurrentText(text);

    // 현재 선택 상태 가져오기
    const selectionState = newEditorState.getSelection();

    // 선택에 관한 정보 추출 (예: anchorOffset, focusOffset, isBackward 등)
    console.log('커서 위치:', selectionState.toJS());
  };


  const handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleTogggleClick = (e: React.MouseEvent, inlineStyle: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleBlockClick = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  React.useEffect(() => {
    console.log(currentText);
    handleSave();
  }, [currentText]);

  return (
    <StyledTexteditor className="texteditor">
      <TitleInput placeholder="title"></TitleInput>
      <ButtonContainer>
        <StyledButton onMouseDown={(e) => handleBlockClick(e, "header-one")}>H1</StyledButton>
        <StyledButton onMouseDown={(e) => handleBlockClick(e, "header-two")}>H2</StyledButton>
        <StyledButton onMouseDown={(e) => handleBlockClick(e, "header-three")}>H3</StyledButton>
        <StyledButton onMouseDown={(e) => handleBlockClick(e, "unstyled")}>Normal</StyledButton>
        <StyledButton onMouseDown={(e) => handleTogggleClick(e, "BOLD")}>bold</StyledButton>
        <StyledButton onMouseDown={(e) => handleTogggleClick(e, "UNDERLINE")}>underline</StyledButton>
        <StyledButton onMouseDown={(e) => handleTogggleClick(e, "ITALIC")}>italic</StyledButton>
        <StyledButton onMouseDown={(e) => handleTogggleClick(e, "STRIKETHROUGH")}>strikethrough</StyledButton>
        <StyledButton onMouseDown={(e) => handleBlockClick(e, "ordered-list-item")}>Ordered List</StyledButton>
        <StyledButton onMouseDown={(e) => handleBlockClick(e, "unordered-list-item")}>Unordered List</StyledButton>
        <StyledButton
          disabled={editorState.getUndoStack().size <= 0}
          onMouseDown={() => setEditorState(EditorState.undo(editorState))}>
          undo
        </StyledButton>
        <StyledButton
          disabled={editorState.getRedoStack().size <= 0}
          onMouseDown={() => setEditorState(EditorState.redo(editorState))}>
          redo
        </StyledButton>
      </ButtonContainer>
      <Editor
        editorState={editorState}
        onChange={(newEditorState) => {
          setEditorState(newEditorState);
          handleChange(newEditorState);
          handleSave();
        }}
        handleKeyCommand={handleKeyCommand}
      />
      <SaveButton
        className="save"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleSave();
        }}>
        save
      </SaveButton>
    </StyledTexteditor>
  );
};

export default TextEditor;