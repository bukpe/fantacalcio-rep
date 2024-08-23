import { useCallback, useEffect, useState } from "react";
import { TeamService } from "../services/TeamService";
import { UsersEnum, UserTeamDTO } from "../types/UserTypes";
export const Team = () => {
  const [teams, setTeams] = useState<UserTeamDTO[]>([]);

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
    ]).then((loadedTeams) => {
      setTeams(loadedTeams);
    });
  }, [getTeam]);

  return (
    <>
      {teams.map((userTeam, j) => {
        return (
          <ul key={j}>
            <p>{userTeam.user.toUpperCase()}</p>
            {userTeam.team.map((el, i) => {
              return <li key={i}>{`${el.role} ${el.name ?? ""}`}</li>;
            })}
          </ul>
        );
      })}
    </>
  );
};
