import { Routes, Route } from "react-router-dom";

import Admin from "./pages/Admin";
import User from "./pages/User";
import Register from "./pages/User/Register";

const App = () => {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<User />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
