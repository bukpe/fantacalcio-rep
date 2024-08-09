import { useCallback, useEffect, useState } from "react";
import { PlayerDTO } from "./Midfielders";

type ComponentProps = {
  users: string[];
};

export const Strikers = ({ users }: ComponentProps) => {
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [strikers, setStrikers] = useState<PlayerDTO[]>([]);

  const getStrikers = useCallback(async (): Promise<PlayerDTO[]> => {
    const response = await fetch("http://localhost:3000/api/strikers");
    return await response.json();
  }, []);

  const getTeam = useCallback(async (): Promise<PlayerDTO[]> => {
    const response = await fetch("http://localhost:3000/api/team");
    return await response.json();
  }, []);

  const loadData = useCallback(() => {
    return Promise.all([getStrikers(), getTeam()]).then(results => {
      const loadedStrikers = results[0];
      const loadedTeam = results[1];
      const teamStrikers = loadedTeam.filter(player => player.role === "ATT").filter(teamStriker => teamStriker.name !== "");
      console.log(teamStrikers);
      const teamStrikersNames = teamStrikers.map(s => s.name);
      const filteredStrikers = loadedStrikers.filter(s => !teamStrikersNames.includes(s.name));
      setList(filteredStrikers);
    });
  }, [getStrikers, getTeam]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      loadData();
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
                  setStrikers(newStrikers);
                  writeToExcel(newStrikers);
                }}
              >
                ADD
              </button>
              <button>ADD TO</button>
              <select>
                {users.map((user, index) => {
                  return <option key={index}>{user}</option>;
                })}
              </select>
              <button>DELETE</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
