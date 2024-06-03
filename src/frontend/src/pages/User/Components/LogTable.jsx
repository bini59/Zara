import styled from "styled-components"

import useGetFetch from "../../../hooks/useGetFetch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`

  width: calc(100% - 5rem);

  max-height: 60vh;
  overflow: auto;
  border: 1px solid #dee2e6;
  border-radius: 0.4rem;
  margin-bottom: 2rem;

  & button {
    width: 5rem;
    height: 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.4rem;
    font-size: 1.2rem;
    font-family: 'Pretendard';
  }

  & > table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center;
    /* margin-bottom: 4rem; */

    & .table-title{
      width: 80%;
      text-align: left;
      padding-left: 3rem;
    }

    & .table-detail {
      width: 20%;
      cursor: pointer;
      // color to gray
      color: #bec9d3;
      font-size: 1.5rem;
    }
    

    font-size: 1.6rem;

    & > thead {
      font-weight: bold;

      & > tr {
        color:#4f575e;
        border-bottom: 1px solid #dee2e6;
      }
    }

    & td, th {
      padding: 1rem 0;
    }

    & > tbody {
      padding-top: 1.5rem;
      // text to align left
      text-align: left;

      & .online {
        font-weight: bold;
        color : #5ccb59;
      }
      & .offline {
        font-weight: bold;
        color : #e74c3c;
      }
      & > tr {
        /* border-bottom: 1px solid #dee2e6; */

        & > td {
          padding-left: 3rem;
        }

        &:hover{
          background-color: #f8f9fa;
        }
      }


      & .on span {
        background-color: #5ccb59;
      }
      & .off span {
        background-color: #e74c3c;
      }
    }
  }
`

// 2021-01-01 09:00:00 -> 2021년 09월 01일 09시 00분 00초
const dateToString = (date) => {
  return `${date.slice(0, 4)}년 ${date.slice(5, 7)}월 ${date.slice(8, 10)}일 ${date.slice(11, 13)}시 ${date.slice(14, 16)}분 ${date.slice(17, 19)}초`
}

const LogTable = () => {
  const navigate = useNavigate();
  const moveTo = (path) => {
    const prefix = "/";
    navigate(`${prefix}${path}`);
  }

  const [isDetail, setIsDetail] = useState(false);
  useEffect(() => {
    // get url and use url to control html rendering
    const url = document.location.href.split("/");
    if (url[url.length - 1] === "logs") {
      setIsDetail(true);
    }
  }, [])

  const [body, setBody] = useState([]);

  const { data, loading } = useGetFetch("/logs/1");
  useEffect(() => {
    if (!loading) {
      console.log(data);

      setBody(data['data'].map((item, index) => {
        if (index > 8 && !isDetail) return null;
        return (
          <tr key={item[0]}>
            <td>
              {dateToString(item[2])}&nbsp;&nbsp;
              <span className={item[3] == "출근" ? "online" : "offline"}>{item[3]}</span>
            </td>
          </tr>
        )
      }))
    }
    
  }, [loading, data])

  return (
    <Container >
      <table>
        <thead>
          <tr>
            <th className="table-title fm">근태로그</th>
            <th className="table-detail" onClick={()=>moveTo('logs')}>{!isDetail ? "상세보기 >>": ""}</th>
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    </Container>
  )

}

export default LogTable;