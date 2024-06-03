import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { FaCalendarAlt as Cal } from "react-icons/fa";
import { IoDocumentText as Log } from "react-icons/io5";

const Container = styled.div`
  width: 20rem;
  min-height: 100vh;
  background-color: rgb(0, 123, 255);
  color: #ffffff;

  & > h2 {
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ffffff;
    font-size: 2.4rem;
  }

  & > ul {
    list-style-type: none;
    padding: 0;
    

    & > li {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1.8rem;

      & > svg {
        margin-right: 12px;
      }

      &:hover {
        background-color: #0056b3;
      }
    }
  }
`

const Sidebar = () => {
  const navigate = useNavigate();
  const moveTo = (path) => {
    const prefix = "";
    navigate(`${prefix}${path}`);
  }

  return (
    <Container>
      <h2>Zara</h2>
      <ul>
        <li onClick={() => moveTo('/')}><Cal /><span>이달의 요약</span>          
        </li>
        <li onClick={()=>moveTo('/logs')}><Log/>로그 상세</li>
      </ul>
    </Container>
  )
};

export default Sidebar;