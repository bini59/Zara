// import { Chart as ChartJS, Tooltip, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
// ChartJS.register(Tooltip, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title);
// import LineGraph from "./Components/LineGraph";

import { useEffect, useState } from "react";
import styled from "styled-components";

import { GoDotFill as Dot } from "react-icons/go";

import DoughnutGraph from "../../Components/DoughnutGraph";
import LogTable from "./Components/LogTable";
import useGetFetch from "../../hooks/useGetFetch";


const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: calc(100% - 35px);

  // px 값들 조정 필요
  margin-left: 3.5rem;
  margin-top: 0;

  & > .top-content {
    display: flex;
    /* justify-content: space-between; */
    margin-top: 2rem;

    & > div{
      margin-right: 5rem;
      border-radius: 1rem;
    }

    & > .current {
      width: 77rem;
      height: 35rem;

      border: 1px solid #d0d0d0;

      padding: 0rem 2.4rem;

      & > div{
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;
        border-bottom: 1px solid #d0d0d0;
      }

      & .online {
        display: flex;
        flex-direction: row;
      }

      & > div:last-child{
        border-bottom: none;
      }

      & .current-text-1 {
        color: #007BFF;
      }
      & .current-text-2 {
        display: flex;
        align-items: center;
        color: #5ccb59;
        font-size: 1.5rem;
        margin-left: 1rem;
      }
      & .current-text-3 {
        color: #DC3545;
      }
    }

    & > .etc {
      width: 32rem;
      height: 35rem;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #ffffff;

      

      & > div {
        width: 32rem;
        height: 35rem;
        border-radius: 1rem;
        padding-left: 3rem;
        padding-top: 2rem;
      }

      & > .trady {
        background-color: #FFD351;
      }

      & > .leave {
        background-color: #3FD2EA;
      }
    }
  }

  & > .bottom-content {
    width: 100%;
    height: 50rem;
    margin-top: 2rem;
  }
`;


const Home = () => {

  const [etc, setEtc] = useState([[0, 0], [0, 0]]);
  const [chartData, setChartData] = useState({
    labels: ["출근", "미출근"],
    datasets: [{
      data: [100, 0],
      backgroundColor: ["#ffffff", "#006FE5"],
      borderWidth: 0
    }]
  });
  const { data, loading } = useGetFetch("/attendance/1");
  

  // etc 데이터값 채우기
  useEffect(() => {
    if (!loading) {
      let tempData = [[0, 0], [0, 0]];
      let total = data.total;
      
      tempData[0][0] = data.late;
      tempData[0][1] = Math.round((data.late / total) * 100);

      tempData[1][0] = data.early_leave;
      tempData[1][1] = Math.round((data.early_leave / total) * 100);

      setEtc(tempData);
    }
  }, [loading, data]);
  
  // doughnut chart 데이터 채우기
  useEffect(() => {
    if (!loading) {
      let total = data.total;
      setChartData({
        labels: ["출근", "미출근"],
        datasets: [{
          data: [data.on_work, total - data.on_work],
          backgroundColor: ["#ffffff", "#006FE5"],
          borderWidth: 0
        }]
      });
    }
  }, [loading]);

  return (
    <Container>
      <section className="top-content">
        <DoughnutGraph chartData={chartData}/>

        <div className="current">
        <div>
            <div className="fb b online">임유빈 <span className="current-text-2 fs b"><Dot/>온라인</span></div>
          </div>
          <div>
            <div className="fm b">출근</div>
            <div className="current-text-1"><span className="fb b">{data.total}</span><span className="fs b"> ({(data.on_work/data.total)*100}%)</span></div>
          </div>
          <div>
            <div className="fm b">결근</div>
            <div className="current-text-3"><span className="fb b">{data.off_work}</span><span className="fs b"> ({(data.off_work/data.total)*100}%)</span></div>
          </div>
        </div>

        <div className="etc">
          <div className="trady">
            <div className="fm b">지각</div>
            <div><span className="fb b">{etc[0][0]}</span><span className="fs b"> ({etc[0][1]}%)</span></div>
          </div>
          {/* <div className="leave">
            <div className="fm b">조퇴</div>
            <div><span className="fb b">{etc[1][0]}</span><span className="fs b"> ({etc[1][1]}%)</span></div>
          </div> */}
        </div>
      </section>

      <section className="bottom-content">
        <LogTable />
      </section>
    </Container>
  )
};

export default Home;