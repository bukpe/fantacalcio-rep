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
import { PlayerDTO, TeamPlayerDTO } from "./types/PlayerTypes";
import { TeamService } from "./services/TeamService";
import { UsersEnum } from "./types/UserTypes";

export const App = () => {
  const [myTeam, setMyTeam] = useState<TeamPlayerDTO[]>([]);
  const [allPlayers, setAllPlayers] = useState<PlayerDTO[]>([]);

  const getTeam = useCallback((user: UsersEnum) => {
    return TeamService.getTeamByUser(user);
  }, []);

  const getPlayers = useCallback(async () => {
    return PlayerService.getPlayers();
  }, []);

  const loadData = useCallback(() => {
    return Promise.all([getPlayers(), getTeam(UsersEnum.BRIAN)]).then(([players, brianTeam]) => {
      setAllPlayers(players);
      setMyTeam(brianTeam);
    });
  }, [getPlayers, getTeam]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="goalkeepers" element={<Goalkeepers allPlayers={allPlayers} myTeam={myTeam} />} />
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
