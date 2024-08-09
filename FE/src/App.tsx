import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { Goalkeepers } from "./pages/Goalkeepers";
import { Defenders } from "./pages/Defenders";
import { Midfielders } from "./pages/Midfielders";
import { Strikers } from "./pages/Strikers";
import { Team } from "./pages/Team";
import { useCallback, useEffect, useState } from "react";

export const App = () => {
  const [users, setUsers] = useState<string[]>([]);
  const getUsers = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/users");
    const data = await response.json();
    setUsers(data);
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="goalkeepers" element={<Goalkeepers />} />
          <Route path="defenders" element={<Defenders />} />
          <Route path="midfielders" element={<Midfielders />} />
          <Route path="strikers" element={<Strikers users={users} />} />
          <Route path="team" element={<Team />} />
          <Route path="*" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
