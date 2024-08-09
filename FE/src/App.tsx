import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { Goalkeepers } from "./pages/Goalkeepers";
import { Defenders } from "./pages/Defenders";
import { Midfielders } from "./pages/Midfielders";
import { Strikers } from "./pages/Strikers";
import { Team } from "./pages/Team";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="goalkeepers" element={<Goalkeepers />} />
          <Route path="defenders" element={<Defenders />} />
          <Route path="midfielders" element={<Midfielders />} />
          <Route path="strikers" element={<Strikers />} />
          <Route path="team" element={<Team />} />
          <Route path="*" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
