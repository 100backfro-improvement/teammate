import styled from "styled-components";
import { Link } from "react-router-dom";

export const CommonSubmitBtn = styled.button`
  background-color: #5dd68e;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  &:hover {
    color: #5dd68e;
  }
`;
