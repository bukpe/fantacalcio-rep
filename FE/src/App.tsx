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
import { SettingsService } from "./services/SettingsService";
import { SettingsDTO } from "./types/SettingsTypes";
import { TeamService } from "./services/TeamService";
import { UsersEnum, UserTeamDTO } from "./types/UserTypes";

export const App = () => {
  const [allPlayers, setAllPlayers] = useState<PlayerDTO[]>([]);
  const [settings, setSettings] = useState<SettingsDTO>({
    creds: 0,
    defendersBudget: 0,
    goalkeepersBudget: 0,
    midfieldersBudget: 0,
    strikersBudget: 0,
  });
  const [myTeam, setMyTeam] = useState<UserTeamDTO | undefined>(undefined);

  const getPlayers = useCallback(async () => {
    return PlayerService.getPlayers();
  }, []);

  const getSettings = useCallback(async () => {
    return SettingsService.getSettings();
  }, []);

  const getMyTeam = useCallback(() => {
    return TeamService.getTeamByUser(UsersEnum.BRIAN);
  }, []);

  const loadData = useCallback(() => {
    return Promise.all([getPlayers(), getSettings(), getMyTeam()]).then(
      ([players, loadedSettings, myCurrentTeam]) => {
        setSettings(loadedSettings);
        setAllPlayers(players);
        setMyTeam(myCurrentTeam);
      }
    );
  }, [getMyTeam, getPlayers, getSettings]);

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
            element={
              <Goalkeepers
                allPlayers={allPlayers}
                settings={settings}
                myTeam={myTeam}
                loadData={loadData}
              />
            }
          />
          <Route
            path="defenders"
            element={
              <Defenders
                allPlayers={allPlayers}
                settings={settings}
                myTeam={myTeam}
                loadData={loadData}
              />
            }
          />
          <Route
            path="midfielders"
            element={
              <Midfielders
                allPlayers={allPlayers}
                settings={settings}
                myTeam={myTeam}
                loadData={loadData}
              />
            }
          />
          <Route
            path="strikers"
            element={
              <Strikers
                allPlayers={allPlayers}
                settings={settings}
                myTeam={myTeam}
                loadData={loadData}
              />
            }
          />
          <Route path="team" element={<Team />} />
          <Route path="*" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
