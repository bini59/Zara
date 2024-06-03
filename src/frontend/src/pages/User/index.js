import Sidebar from "./Components/Sidebar";
import Home from "./Home";
import Register from "./Register";
import Logs from "./Logs";

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

const User = () => {
    return (
        <Container>
            <Sidebar />
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logs" element={<Logs />} />
                </Routes>
            </div>
        </Container>
    );
}

export default User;