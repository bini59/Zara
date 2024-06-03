import styled from "styled-components";

import ManageTable from "./Components/ManageTable";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  padding: 2rem 4rem;

  & > h1{
    font-size: 2.4rem;
    margin-bottom: 1.5rem;
  }

  & > div {
    max-height: 78vh;
  }

  & > button {
    width: 10rem;
    height: 4rem;
    background-color: rgb(0, 123, 255);
    color: white;
    border: none;
    border-radius: 0.4rem;
    margin-top: 2rem;
    align-self: flex-start;
    font-size: 1.6rem;
    /* font-weight: bold; */
    font-family: 'Pretendard';
  }
`

const Logs = () => {
  return (
    <Container>
      <h1>근태 로그</h1>
      <ManageTable url={"logs/1"} />
    </Container>
  );
}

export default Logs;