import { useCallback, useEffect, useState } from "react";
import { PlayerDTO } from "../types/PlayerTypes";

export const Team = () => {
  const [team, setTeam] = useState<PlayerDTO[]>([]);

  const getTeam = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/team");
    const data: PlayerDTO[] = await response.json();
    setTeam(data);
  }, []);

  useEffect(() => {
    getTeam();
  }, [getTeam]);

  return (
    <ul>
      {team.map((el, i) => {
        return <li key={i}>{`${el.role} ${el.name ?? ""}`}</li>;
      })}
    </ul>
  );
};
