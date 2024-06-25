import { useCallback, useEffect, useState } from "react";
import { PlayerDTO } from "./Midfielders";

export const Defenders = () => {
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [defenders, setDefenders] = useState<PlayerDTO[]>([]);
  const [teamsAlreadyUsed, setTeamsAlreadyUsed] = useState<PlayerDTO["team"][]>(
    []
  );

  const getDefenders = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/defenders");
    const data: PlayerDTO[] = await response.json();
    const filteredData = data.filter(
      (el) => !teamsAlreadyUsed.includes(el.team)
    );
    setList(filteredData.slice(0, 50));
  }, [teamsAlreadyUsed]);

  const getTeam = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/team");
    const data: PlayerDTO[] = await response.json();
    const teamDefenders = data.filter((el) => el.role === "DIF");
    const newTeamsAlreadyUsed = teamDefenders.map((el) => el.team);
    setTeamsAlreadyUsed(newTeamsAlreadyUsed);
  }, []);

  useEffect(() => {
    getTeam();
  }, [getTeam]);

  useEffect(() => {
    getDefenders();
  }, [getDefenders]);

  const writeToExcel = async (newDefenders: PlayerDTO[]) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/insertDefenders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            defenders: newDefenders,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore nella richiesta");
      }
      getDefenders();
      response.text();
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <div className="App">
      <ul>
        {list.map((el, i) => {
          const value = Math.ceil(el.value * 0.8);
          return (
            <li style={{ display: "flex" }} key={i}>
              <p>{`${el.name}
              
              ${value}
              
              ${el.team}`}</p>
              <button
                onClick={() => {
                  const newDefenders: PlayerDTO[] = [
                    ...defenders,
                    {
                      fvm: el.fvm,
                      name: el.name,
                      team: el.team,
                      value,
                      role: el.role,
                    },
                  ];
                  setDefenders(newDefenders);
                  writeToExcel(newDefenders).then(() => {
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
