import { useState, useEffect, useReducer } from "react";
import styled from "styled-components";
import axios from "axios";

import useGetFetch from "../../../hooks/useGetFetch";
import UserDetail from "./UserDetail";

const initialState = {};

const PREFIX = "http://127.0.0.1:8000/api/v1";

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_ROW':
      return {
        ...state,
        [action.id]: !state[action.id]
      };
    default:
      return state;
  }
}


const Container = styled.div`

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
    margin-bottom: 4rem;
    

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
      .user-detail{
        border: 0;
        & td {
          padding: 0;

          & > div {
            padding: 0;
            max-height: 0;
            
            overflow: hidden;
            transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
          }
        }
        &.active{
          border-top: 1px solid #dee2e6;
          border-bottom: 1px solid #dee2e6;

          & td > div{
            max-height: 400px;
            transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
          }
        }
      }
      & > tr {
        border-bottom: 1px solid #dee2e6;

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
const Dot = styled.span`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  display: inline-block;
`

const postEmployee = async (userid) => {
  try {
    const response = await axios.get(`${PREFIX}/employees/apply/${userid}`)
    if (response.data.status === "success") {
      alert("등록되었습니다.");
    }
  }
  catch (error) {
    console.log(error);
  }
}


const ManageTable = ({ url }) => {
  const { data, loading } = useGetFetch(`/${url}`);

  const [header, setHeader] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!loading) {
      setHeader(data.header);
    }
  }, [loading, data]);

  useEffect(() => {
    if (!loading) {
      setTableData(data.data);
    }
  }, [data, loading]);


  const [visibleRows, dispatch] = useReducer(reducer, initialState);
  const toggleDetail = (userId) => {
    dispatch({ type: 'TOGGLE_ROW', id: userId });
  }

  return (
    <Container>
      <table>
        <thead>
          <tr>{header.map((item, index) => { return <th key={index}>{item}</th> })}</tr>
        </thead>
        <tbody>
          {
            tableData.map((item, index) => {
              return (
                <>
                <tr key={index} onClick={()=>toggleDetail(item[0])}>
                  {item.map((data, index_2) => {
                    if (index_2 === 0) {
                      return <td key={index} id={data}>{index+1}</td>
                    }
                    if (data === true || data === false) {
                      return <td key={index} className={data === true ? "now on" : "now off"}><Dot/></td>
                    }
                    return <td key={index}>{data}</td>
                  })}
                  {url === "employees/new" ? <td><button onClick={() => postEmployee(item[0])}>등록</button></td> : null}
                  </tr>
                  {
                    url === "employees/list" ?
                      <tr className={"user-detail" + (visibleRows[item[0]] ? " active" : "")}><td colSpan={4}><UserDetail user={item[0]} /></td></tr> :
                      null
                  }
                  </>
                  
              )
            })
          }
        </tbody>

      </table>
    </Container>
  );
};

export default ManageTable;