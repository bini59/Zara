import { useState, useEffect } from "react";
import styled from "styled-components";

import useGetFetch from "../../../hooks/useGetFetch";

const Container = styled.div`

  height: 80vh;
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


const postEmployee = async (data) => {
  alert('직원 추가 완료');
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
                <tr key={index}>
                  {item.map((data, index_2) => {
                    console.log(data)
                    if (index_2 === 0) {
                      return <td key={index} id={data}>{index+1}</td>
                    }
                    if (data == true || data == false) {
                      return <td key={index} className={data == true ? "now on" : "now off"}><Dot/></td>
                    }
                    return <td key={index}>{data}</td>
                  })}
                  {url === "employees/new" ? <td><button onClick={() => postEmployee(item[0])}>등록</button></td> : null}
                </tr>
              )
            })
          }
        </tbody>

      </table>
    </Container>
  );
};

export default ManageTable;