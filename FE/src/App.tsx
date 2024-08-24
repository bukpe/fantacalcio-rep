import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { Goalkeepers } from "./pages/Goalkeepers";
import { Defenders } from "./pages/Defenders";
import { Midfielders } from "./pages/Midfielders";
import { Strikers } from "./pages/Strikers";
import { Team } from "./pages/Team";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PlayerService } from "./services/PlayerService";
import { PlayerDTO, TeamPlayerDTO } from "./types/PlayerTypes";
import { SettingsService } from "./services/SettingsService";
import { SettingsDTO } from "./types/SettingsTypes";
import { TeamService } from "./services/TeamService";
import { UsersEnum, UserTeamDTO } from "./types/UserTypes";
import _ from "lodash";

export const App = () => {
  const [allPlayers, setAllPlayers] = useState<PlayerDTO[]>([]);
  const [settings, setSettings] = useState<SettingsDTO>({
    creds: 0,
    defendersBudget: 0,
    goalkeepersBudget: 0,
    midfieldersBudget: 0,
    strikersBudget: 0,
  });
  const [teams, setTeams] = useState<UserTeamDTO[]>([]);

  const soldPlayers = useMemo(() => {
    return teams.flatMap(team =>
      team.team.reduce<TeamPlayerDTO[]>((acc, player) => {
        if (player.name !== "" && !_.isNil(player.name)) {
          acc.push(player);
        }
        return acc;
      }, [])
    );
  }, [teams]);

  const getPlayers = useCallback(async () => {
    return PlayerService.getPlayers();
  }, []);

  const getSettings = useCallback(async () => {
    return SettingsService.getSettings();
  }, []);

  const getTeam = useCallback((user: UsersEnum) => {
    return TeamService.getTeamByUser(user);
  }, []);

  const loadData = useCallback(() => {
    return Promise.all([getPlayers(), getSettings(), ...Object.values(UsersEnum).map(user => getTeam(user))]).then(([players, loadedSettings, ...loadedTeams]) => {
      setSettings(loadedSettings);
      setAllPlayers(players);
      setTeams(loadedTeams);
    });
  }, [getPlayers, getSettings, getTeam]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="goalkeepers" element={<Goalkeepers soldPlayers={soldPlayers} allPlayers={allPlayers} settings={settings} teams={teams} loadData={loadData} />} />
          <Route path="defenders" element={<Defenders soldPlayers={soldPlayers} allPlayers={allPlayers} settings={settings} teams={teams} loadData={loadData} />} />
          <Route path="midfielders" element={<Midfielders soldPlayers={soldPlayers} allPlayers={allPlayers} settings={settings} teams={teams} loadData={loadData} />} />
          <Route path="strikers" element={<Strikers soldPlayers={soldPlayers} allPlayers={allPlayers} settings={settings} teams={teams} loadData={loadData} />} />
          <Route path="team" element={<Team settings={settings} teams={teams} loadData={loadData} />} />
          <Route path="*" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
