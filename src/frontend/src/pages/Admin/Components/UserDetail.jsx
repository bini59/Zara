import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Line } from "react-chartjs-2"

import useGetFetch from "../../../hooks/useGetFetch"
import LineGraph from "./LineGraph"
import Tab from "../../../Components/Tab"

const Container = styled.div`
  padding: 20px;

  & canvas {
    height: 300px;
  }

`

const LineOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: true,
      // text: '주간 출근율',
      font: {
        family: 'Pretendard',
        size: '24'
      }
    }
  },
  scales: {
    y: {

      max: 100
    }
  },
  elements: {
    point: {
      radius: 5,
      hoverRadius: 7
    }
  }
}



const UserDetail = ({ user }) => {

  const [weeklylineData, setWeeklyLineData] = useState({
    labels: [],
    datasets: [{
        label: "출근율",
        data: [],
        fill: false,
        backgroundColor: "#007BFF",
        borderColor: "rgba(0, 123, 255, 0.2)",
    }]
  });
  const [monthlylineData, setMonthlyLineData] = useState({
    labels: [],
    datasets: [{
        label: "출근율",
        data: [],
        fill: false,
        backgroundColor: "#007BFF",
        borderColor: "rgba(0, 123, 255, 0.2)",
    }]
  });
  const { data, loading } = useGetFetch(`/detail/${user}`);

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
      for (let i = 0; i < 4; i++) {
        tempData.labels.push(`${i+1}주차`);
        tempData.datasets[0].data.push(data.weekly[i]);
      }
      setWeeklyLineData(tempData);

      tempData = {
        labels: [],
        datasets: [{
            label: "출근율",
            data: [],
            fill: false,
            backgroundColor: "#007BFF",
            borderColor: "rgba(0, 123, 255, 0.2)",
        }]
      }
      for (let i = 0; i < 12; i++) {
        tempData.labels.push(`${i+1}월`);
        tempData.datasets[0].data.push(data.monthly[i]);
      }
      setMonthlyLineData(tempData);
    }
  }, [loading, data]);


  return (
    <Container>
      <Tab childrens={[
        { tabName: "주차별 출근율", tabContent: <Line data={weeklylineData} options={LineOptions}/> },
        { tabName: "월별 출근율", tabContent: <Line data={monthlylineData} options={LineOptions}/> }]} />
      
    </Container>
  )
}

export default UserDetail;