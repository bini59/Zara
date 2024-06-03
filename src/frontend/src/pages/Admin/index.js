import Home from "./Home";
import Login from "./Login";
import Manage from "./Manage";
import Logs from "./Logs";

import Sidebar from "./Components/Sidebar";

import { Routes, Route } from "react-router-dom";

import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: row;

    & > div {
        padding: 20px;
    }

    & > div:nth-child(1) {
        min-width: 240px;
    }

    & > div:nth-child(2) {
        flex: 1;
    }
`;

const Admin = () => {
    return (
        <Container>
            <Sidebar />
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/manage" element={<Manage />} />
                    <Route path="/logs" element={<Logs />} />
                </Routes>
            </div>
        </Container>
    );
}

export default Admin;