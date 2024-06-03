import styled from "styled-components";
import axios from "axios";

import ManageTable from "./Components/ManageTable";

const PREFIX = "http://localhost:8000/api/v1";

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

const downloadLogs = async () => {
  try {
    const res = await axios.get(PREFIX+"/logs/download", {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '근태로그.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.log(err);
  }
}

const Logs = () => {
  return (
    <Container>
      <h1>근태 로그</h1>
      <ManageTable url={"logs"} />
      <button onClick={downloadLogs}>다운로드</button>
    </Container>
  );
}

export default Logs;