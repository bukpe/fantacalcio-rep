import { useCallback, useEffect, useState } from "react";
import { TeamPlayerDTO } from "../types/PlayerTypes";
import { TeamService } from "../services/TeamService";
import { UsersEnum } from "../types/UserTypes";
export const Team = () => {
  const [teams, setTeams] = useState<TeamPlayerDTO[][]>([]);

  const getTeam = useCallback((user: UsersEnum) => {
    return TeamService.getTeamByUser(user);
  }, []);

  useEffect(() => {
    Promise.all([
      getTeam(UsersEnum.BRIAN),
      getTeam(UsersEnum.LAZZA),
      getTeam(UsersEnum.MICHE),
      getTeam(UsersEnum.MICHI),
      getTeam(UsersEnum.PIANTA),
      getTeam(UsersEnum.PIER),
      getTeam(UsersEnum.SIMO),
      getTeam(UsersEnum.SUPER),
      getTeam(UsersEnum.TIZI),
      getTeam(UsersEnum.VAVA),
    ]).then(loadedTeams => {
      setTeams(loadedTeams);
    });
  }, [getTeam]);

  return (
    <>
      {teams.map(team => {
        return (
          <ul>
            {team.map((el, i) => {
              return <li key={i}>{`${el.role} ${el.name ?? ""}`}</li>;
            })}
          </ul>
        );
      })}
    </>
  );
};
