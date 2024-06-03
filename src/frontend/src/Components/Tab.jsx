// Tab Component
// childrens: childrens
// create number of tabs with childrens number

/** childrens:
 * tabName: tab name
 * tabContent: elements
 */
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  .tabs {
    display: flex;
    cursor: pointer;
  }

  .tab {
    font-weight: bold;
    flex: 1;
    padding: 12px 16px;
    text-align: center;
  }

  .tab:hover {
    color: rgb(0, 123, 255);
  }

  .tab.active {
    color :rgb(0, 123, 255);
    border-bottom: 2px solid rgb(0, 123, 255);
  }

  .tab-content {
    /* border: 1px solid #ccc; */
    padding: 20px;
    margin-top: -1px; /* To fix the border overlap issue */
  }
`;

const Tab = ({ childrens }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabClickMethod = (idx) => {
    setActiveTab(idx);
  }

  return (
    <Container>
      <div className="tabs">
        {childrens.map((child, idx) => {
          return (
            <div
              key={idx}
              className={"tab" + (activeTab === idx ? " active" : "")}
              onClick={() => tabClickMethod(idx)}
            >
              {child.tabName}
            </div>
          );
        })}
      </div>
      <div className="tab-content">
        {childrens[activeTab].tabContent}
      </div>
    </Container>
  ); 
}

export default Tab;