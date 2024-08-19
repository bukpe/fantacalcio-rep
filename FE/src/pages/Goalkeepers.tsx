import { useCallback, useEffect, useState } from "react";
import { GoalkeeperPositionEnum, PlayerDTO, RoleEnum, TeamPlayerDTO } from "../types/PlayerTypes";
import { PlayerService } from "../services/PlayerService";
import { UsersEnum } from "../types/UserTypes";

type ComponentProps = {
  allPlayers: PlayerDTO[];
  myTeam: TeamPlayerDTO[];
};

export const Goalkeepers = ({ allPlayers, myTeam }: ComponentProps) => {
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [playerPosition, setPlayerPosition] = useState<GoalkeeperPositionEnum>(GoalkeeperPositionEnum.PRIMO);
  const [selectedUser, setSelectedUser] = useState<UsersEnum>(UsersEnum.BRIAN);
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    const allGoalkeepers = allPlayers.filter(player => player.role === RoleEnum.POR);
    setList(allGoalkeepers);
  }, [allPlayers]);

  const insertGoalkeeper = useCallback((player: TeamPlayerDTO, user: UsersEnum, position: GoalkeeperPositionEnum) => {
    return PlayerService.insertGoalkeeper(player, user, position);
  }, []);

  return (
    <div className="App">
      <input
        type="text"
        value={purchaseValue}
        onChange={event => {
          setPurchaseValue(Number.isNaN(parseInt(event.target.value)) ? undefined : parseInt(event.target.value));
        }}
      />
      <select value={GoalkeeperPositionEnum[playerPosition]} onChange={e => setPlayerPosition(GoalkeeperPositionEnum[e.target.value as keyof typeof GoalkeeperPositionEnum])}>
        {Object.keys(GoalkeeperPositionEnum).map((option, i) => {
          if (Number.isNaN(parseInt(option))) {
            return <option key={i}>{option}</option>;
          }
          return null;
        })}
      </select>
      <select value={UsersEnum[selectedUser]} onChange={e => setSelectedUser(UsersEnum[e.target.value as keyof typeof UsersEnum])}>
        {Object.keys(UsersEnum).map((option, i) => {
          if (Number.isNaN(parseInt(option))) {
            return <option key={i}>{option}</option>;
          }
          return null;
        })}
      </select>
      <ul>
        {list.map((el, i) => {
          return (
            <li style={{ display: "flex" }} key={i}>
              <p>{`${el.name}
              
              ${el.maxValue}
              
              ${el.team}`}</p>
              <button
                disabled={purchaseValue === undefined}
                onClick={() => {
                  insertGoalkeeper(PlayerService.mapPlayerDTOToTeamPlayerDTO(el, purchaseValue ?? 1), selectedUser, playerPosition);
                  setPurchaseValue(1);
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
