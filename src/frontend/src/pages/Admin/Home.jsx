import { useEffect, useState } from "react";
import { Chart as ChartJS, Tooltip, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
import styled from "styled-components";

import DoughnutGraph from "../../Components/DoughnutGraph";
import LineGraph from "./Components/LineGraph";
import useGetFetch from "../../hooks/useGetFetch";

ChartJS.register(Tooltip, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title);

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
        padding-bottom: 1rem;
        border-bottom: 1px solid #d0d0d0;
      }

      & > div:last-child{
        border-bottom: none;
      }

      & .current-text-1 {
        color: #007BFF;
      }
      & .current-text-2 {
        color: #000000;
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

  const [current, setCurrent] = useState([[0, 0], [0, 0], [0, 0]]);
  const [etc, setEtc] = useState([[0, 0], [0, 0]]);
  const [chartData, setChartData] = useState({
    labels: ["출근", "미출근"],
    datasets: [{
      data: [100, 0],
      backgroundColor: ["#ffffff", "#006FE5"],
      borderWidth: 0
    }]
  });
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{
        label: "출근율",
        data: [],
        fill: false,
        backgroundColor: "#007BFF",
        borderColor: "rgba(0, 123, 255, 0.2)",
    }]
  });
  const { data, loading } = useGetFetch("/attendance/summary");
  

  // current 데이터값 채우기
  useEffect(() => {
    if (!loading) {
      let tempData = [[0, 0], [0, 0], [0, 0]];
      let total = data.total;
      
      tempData[0][0] = data.on_work;
      tempData[0][1] = Math.round((data.on_work / total) * 100);

      tempData[1][0] = data.yet_to_clock_out;
      tempData[1][1] = Math.round((data.yet_to_clock_out / total) * 100);

      tempData[2][0] = data.off_work;
      tempData[2][1] = Math.round((data.off_work / total) * 100);
      console.log(tempData);
      setCurrent(tempData);
    }
  }, [loading, data]);

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
  }, [loading, current]);

  // line chart 데이터 채우기
  useEffect(() => {
    if (!loading) {
      let tempData = {
        labels: [],
        datasets: [{
            label: "출근율",
            data: [],
            fill: false,
            backgroundColor: "#007BFF",
            borderColor: "rgba(0, 123, 255, 0.2)",
        }]
      }
      for (let i = 0; i < 7; i++) {
        tempData.labels.push(data.weekly['labels'][i]);
        tempData.datasets[0].data.push(data.weekly['data'][i]);
      }
      setLineData(tempData);
    }
  }, [loading, data]);

  return (
    <Container>
      <section className="top-content">
        <DoughnutGraph chartData={chartData}/>

        <div className="current">
          <div>
            <div className="fm b">출근</div>
            <div className="current-text-1"><span className="fb b">{current[0][0]}</span><span className="fs b"> ({current[0][1]}%)</span></div>
          </div>
          <div>
            <div className="fm b">출근 시간 전</div>
            <div className="current-text-2"><span className="fb b">{current[1][0]}</span><span className="fs b"> ({current[1][1]}%)</span></div>
          </div>
          <div>
            <div className="fm b">결근</div>
            <div className="current-text-3"><span className="fb b">{current[2][0]}</span><span className="fs b"> ({current[2][1]}%)</span></div>
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
        <LineGraph lineData={lineData} />
      </section>
    </Container>
  )
};

export default Home;