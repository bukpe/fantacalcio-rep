import { useCallback, useEffect, useState } from "react";
import { PlayerDTO } from "./Midfielders";

export const Goalkeepers = () => {
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [goalkeepers, setGoalkeepers] = useState<PlayerDTO[]>([]);
  console.log(goalkeepers);

  const getGoalkeepers = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/goalkeepers");
    const data: PlayerDTO[] = await response.json();
    const myGoalkeepers = goalkeepers.map((el) => el.name);
    setList(data.filter((el) => !myGoalkeepers.includes(el.name)).slice(0, 50));
  }, [goalkeepers]);

  const getTeam = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/team");
    const data: PlayerDTO[] = await response.json();
    const teamGoalkeepers = data.filter(
      (el) => el.role === "POR" && el.name !== ""
    );
    setGoalkeepers(teamGoalkeepers);
  }, []);

  useEffect(() => {
    getTeam();
  }, [getTeam]);

  useEffect(() => {
    getGoalkeepers();
  }, [getGoalkeepers]);

  const writeToExcel = async (newGoalkeepers: PlayerDTO[]) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/insertGoalkeepers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goalkeepers: newGoalkeepers,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore nella richiesta");
      }
      getGoalkeepers();
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
                  const newGoalkeepers: PlayerDTO[] = [
                    ...goalkeepers,
                    {
                      fvm: el.fvm,
                      name: el.name,
                      team: el.team,
                      value,
                      role: el.role,
                    },
                  ];
                  writeToExcel(newGoalkeepers).then(() => {
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
