import { useCallback, useEffect, useState } from "react";
import { PlayerDTO, RoleEnum } from "../types/PlayerTypes";

export const Midfielders = () => {
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [midfielders, setMidfielders] = useState<PlayerDTO[]>([]);
  const [teamsAlreadyUsed, setTeamsAlreadyUsed] = useState<PlayerDTO["team"][]>([]);

  console.log(list, midfielders, teamsAlreadyUsed);

  const getMidfielders = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/midfielders");
    const data: PlayerDTO[] = await response.json();
    const filteredData = data.filter(el => !teamsAlreadyUsed.includes(el.team));
    setList(filteredData.slice(0, 50));
  }, [teamsAlreadyUsed]);

  const getTeam = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/team");
    const data: PlayerDTO[] = await response.json();
    const teamMidfielders = data.filter(el => el.role === RoleEnum.CEN);
    const newTeamsAlreadyUsed = teamMidfielders.map(el => el.team);
    setTeamsAlreadyUsed(newTeamsAlreadyUsed);
  }, []);

  useEffect(() => {
    getTeam();
  }, [getTeam]);

  useEffect(() => {
    getMidfielders();
  }, [getMidfielders]);

  const writeToExcel = async (newMidfielders: PlayerDTO[]) => {
    try {
      const response = await fetch("http://localhost:3000/api/insertMidfielders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          midfielders: newMidfielders,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore nella richiesta");
      }
      getMidfielders();
      const data = await response.text();
      console.log("Risposta dal server:", data);
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <div className="App">
      <ul>
        {list.map((el, i) => {
          const maxValue = el.maxValue * 0.8;
          return (
            <li style={{ display: "flex" }} key={i}>
              <p>{`${el.name}
              
              ${maxValue}
              
              ${el.team}`}</p>
              <button
                onClick={() => {
                  const newMidfielders: PlayerDTO[] = [
                    ...midfielders,
                    {
                      fvm: el.fvm,
                      name: el.name,
                      team: el.team,
                      maxValue,
                      role: el.role,
                    },
                  ];
                  setMidfielders(newMidfielders);
                  writeToExcel(newMidfielders).then(() => {
                    getTeam();
                  });
                }}
              >
                ADD
              </button>
              <button>DELETE</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
