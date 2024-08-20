import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { Goalkeepers } from "./pages/Goalkeepers";
import { Defenders } from "./pages/Defenders";
import { Midfielders } from "./pages/Midfielders";
import { Strikers } from "./pages/Strikers";
import { Team } from "./pages/Team";
import { useCallback, useEffect, useState } from "react";
import { PlayerService } from "./services/PlayerService";
import { PlayerDTO } from "./types/PlayerTypes";

export const App = () => {
  const [allPlayers, setAllPlayers] = useState<PlayerDTO[]>([]);

  const getPlayers = useCallback(async () => {
    return PlayerService.getPlayers();
  }, []);

  const loadData = useCallback(() => {
    return Promise.all([getPlayers()]).then(([players]) => {
      setAllPlayers(players);
    });
  }, [getPlayers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="goalkeepers" element={<Goalkeepers allPlayers={allPlayers} />} />
          <Route path="defenders" element={<Defenders allPlayers={allPlayers} />} />
          <Route path="midfielders" element={<Midfielders allPlayers={allPlayers} />} />
          <Route path="strikers" element={<Strikers allPlayers={allPlayers} />} />
          <Route path="team" element={<Team />} />
          <Route path="*" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
