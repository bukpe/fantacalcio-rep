import { useCallback, useEffect, useState } from "react";
import { PlayerDTO } from "./Midfielders";

export const Strikers = () => {
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [strikers, setStrikers] = useState<PlayerDTO[]>([]);

  const getStrikers = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/strikers");
    const data: PlayerDTO[] = await response.json();
    const myStrikers = strikers.map((el) => el.name);
    setList(data.filter((el) => !myStrikers.includes(el.name)).slice(0, 50));
  }, [strikers]);

  const getTeam = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/team");
    const data: PlayerDTO[] = await response.json();
    const teamStrikers = data.filter(
      (el) => el.role === "ATT" && el.name !== ""
    );
    setStrikers(teamStrikers);
  }, []);

  useEffect(() => {
    getTeam();
  }, [getTeam]);

  useEffect(() => {
    getStrikers();
  }, [getStrikers]);

  const writeToExcel = async (newStrikers: PlayerDTO[]) => {
    try {
      const response = await fetch("http://localhost:3000/api/insertStrikers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          strikers: newStrikers,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore nella richiesta");
      }
      getStrikers();
      response.text();
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
                  const newStrikers: PlayerDTO[] = [
                    ...strikers,
                    {
                      fvm: el.fvm,
                      name: el.name,
                      team: el.team,
                      value,
                      role: el.role,
                    },
                  ];
                  writeToExcel(newStrikers).then(() => {
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
