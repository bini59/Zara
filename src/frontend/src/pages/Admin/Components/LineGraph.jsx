import styled from "styled-components";
import { Line } from "react-chartjs-2";


const LineGraphDiv = styled.div`
  width: calc(100% - 5rem);
  height: 100%;
  
  /* border: 1px solid #d0d0d0;
  border-radius: 1rem; */

  & > canvas {
    width: 100% !important;
    height: 100% !important;
  
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
      text: '주간 출근율',
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


const LineGraph = ({lineData}) => {  

  return (
    <LineGraphDiv className="lineGraph">
      <Line data={lineData} options={LineOptions}/>
    </LineGraphDiv>
  )
}

export default LineGraph;