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
import { TeamService } from "./services/TeamService";
import { UsersEnum } from "./types/UserTypes";

export const App = () => {
  const [allPlayers, setAllPlayers] = useState<PlayerDTO[]>([]);

  const getTeamByUser = useCallback(() => {
    return TeamService.getTeamByUser(UsersEnum.BRIAN);
  }, []);

  const getPlayers = useCallback(async () => {
    return PlayerService.getPlayers();
  }, []);

  const loadData = useCallback(() => {
    return Promise.all([getPlayers(), getTeamByUser()]).then(
      ([players, team]) => {
        console.log(team);
        setAllPlayers(players);
      }
    );
  }, [getPlayers]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            path="goalkeepers"
            element={<Goalkeepers allPlayers={allPlayers} />}
          />
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
