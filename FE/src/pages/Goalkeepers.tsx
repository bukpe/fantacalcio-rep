import { useEffect, useState } from "react";
import { PlayerDTO, RoleEnum } from "../types/PlayerTypes";

type ComponentProps = {
  allPlayers: PlayerDTO[];
};

export const Goalkeepers = ({ allPlayers }: ComponentProps) => {
  const [list, setList] = useState<PlayerDTO[]>([]);

  useEffect(() => {
    const allGoalkeepers = allPlayers.filter(
      (player) => player.role === RoleEnum.POR
    );
    setList(allGoalkeepers);
  }, [allPlayers]);

  return (
    <div className="App">
      <ul>
        {list.map((el, i) => {
          return (
            <li style={{ display: "flex" }} key={i}>
              <p>{`${el.name}
              
              ${el.maxValue}
              
              ${el.team}`}</p>
              <button onClick={() => undefined}>ADD</button>
              <button>DELETE</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
