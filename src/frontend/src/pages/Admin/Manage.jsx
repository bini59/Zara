import styled from "styled-components";

import ManageTable from "./Components/ManageTable";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  padding: 2rem 4rem;

  & > .title{
    font-size: 2.4rem;
    margin-bottom: 1.5rem;
  }
`

const Manage = () => {
  return (
    <Container>
      <h1 className="title">신규 직원</h1>
      <ManageTable url={"employees/new"} />
      <h1 className="title">직원 목록</h1>
      <ManageTable url={"employees/list"} />
    </Container>
  );
};

export default Manage;