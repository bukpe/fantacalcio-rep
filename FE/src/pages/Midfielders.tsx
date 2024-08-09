import { useCallback, useEffect, useState } from "react";

export type PlayerDTO = {
  name: string;
  fvm: number;
  value: number;
  team: string;
  role: "POR" | "DIF" | "CEN" | "ATT";
};

export const Midfielders = () => {
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [midfielders, setMidfielders] = useState<PlayerDTO[]>([]);
  const [teamsAlreadyUsed, setTeamsAlreadyUsed] = useState<PlayerDTO["team"][]>(
    []
  );

  console.log(list, midfielders, teamsAlreadyUsed);

  const getMidfielders = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/midfielders");
    const data: PlayerDTO[] = await response.json();
    const filteredData = data.filter(
      (el) => !teamsAlreadyUsed.includes(el.team)
    );
    setList(filteredData.slice(0, 50));
  }, [teamsAlreadyUsed]);

  const getTeam = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/team");
    const data: PlayerDTO[] = await response.json();
    const teamMidfielders = data.filter((el) => el.role === "CEN");
    const newTeamsAlreadyUsed = teamMidfielders.map((el) => el.team);
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
      const response = await fetch(
        "http://localhost:3000/api/insertMidfielders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            midfielders: newMidfielders,
          }),
        }
      );

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
          const value = el.value * 0.8;
          return (
            <li style={{ display: "flex" }} key={i}>
              <p>{`${el.name}
              
              ${value}
              
              ${el.team}`}</p>
              <button
                onClick={() => {
                  const newMidfielders: PlayerDTO[] = [
                    ...midfielders,
                    {
                      fvm: el.fvm,
                      name: el.name,
                      team: el.team,
                      value,
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
