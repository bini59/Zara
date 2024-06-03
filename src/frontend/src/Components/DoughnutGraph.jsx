import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";

const chartOptions = {
  cutout: "90%",
}

const DoughnutDiv = styled.div`
  width: 35rem;
  height: 35rem;
  background-color: #007BFF;

  display: flex;
  flex-direction: column;
  align-items: center;

  & > .doughtnut-Graph{
    margin-top: 2rem;
    width: 25rem;
    height: 25rem;
  }

  & > .graph-legend {
    color: #ffffff;
    font-size: 1.6rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1rem;

    position: relative;
    top: 35%;
    transform: translateY(-35%);
    height: 0;

    & > span:first-child {
      font-size: 3rem;
    }
  }

  & > .graph-detail {
    color: #ffffff;
    font-size: 1.6rem;
    font-weight: 700;
    text-align: center;
    margin-top: 2rem;
  }
`

const DoughnutGraph = ({chartData}) => {

  return (
    <DoughnutDiv className="doughnut">
      <div className="graph-legend"><span>{Math.round(chartData['datasets'][0]['data'][0]*100/(chartData['datasets'][0]['data'][0] + chartData['datasets'][0]['data'][1]))}%</span><br />출근율</div>
      <div className="doughtnut-Graph"><Doughnut options={chartOptions} data={chartData}/></div>

      <div className="graph-detail">{chartData['datasets'][0]['data'][0]}/{chartData['datasets'][0]['data'][0]+chartData['datasets'][0]['data'][1]}</div>
    </DoughnutDiv>
  )
};

export default DoughnutGraph;