import { useCallback, useEffect, useState } from "react";
import { GoalkeeperPositionEnum, PlayerDTO, RoleEnum, TeamPlayerDTO } from "../types/PlayerTypes";
import { PlayerService } from "../services/PlayerService";
import { UsersEnum } from "../types/UserTypes";
import _ from "lodash";

type ComponentProps = {
  allPlayers: PlayerDTO[];
};

export const Goalkeepers = ({ allPlayers }: ComponentProps) => {
  const [list, setList] = useState<PlayerDTO[]>([]);
  const [playerPosition, setPlayerPosition] = useState<GoalkeeperPositionEnum>(GoalkeeperPositionEnum.PRIMO);
  const [selectedUser, setSelectedUser] = useState<UsersEnum>(UsersEnum.BRIAN);
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(undefined);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDTO | undefined>(undefined);
  const [searchedPlayers, setSearchedPlayers] = useState<PlayerDTO[]>([]);

  useEffect(() => {
    const allGoalkeepers = allPlayers.filter(player => player.role === RoleEnum.POR);
    setList(allGoalkeepers);
  }, [allPlayers]);

  const insertGoalkeeper = useCallback((player: TeamPlayerDTO, user: UsersEnum, position: GoalkeeperPositionEnum) => {
    return PlayerService.insertGoalkeeper(player, user, position);
  }, []);

  const buildList = useCallback((list: PlayerDTO[]) => {
    return list.map((el, i) => {
      return (
        <li style={{ display: "flex" }} key={i} onClick={() => setSelectedPlayer(el)}>
          <p>{`${el.name}
          
          ${el.maxValue}
          
          ${el.team}`}</p>
        </li>
      );
    });
  }, []);

  return (
    <div className="App">
      <input
        type="text"
        onChange={event => {
          const value = event.target.value;
          const filteredList = list.filter(el => el.name.toLowerCase().includes(value.toLowerCase()));
          setSearchedPlayers(filteredList);
        }}
      />
      {!_.isNil(selectedPlayer) && <div>{selectedPlayer.name}</div>}
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
      <button
        disabled={purchaseValue === undefined || selectedPlayer === undefined}
        onClick={() => {
          insertGoalkeeper(PlayerService.mapPlayerDTOToTeamPlayerDTO(selectedPlayer, purchaseValue ?? 1), selectedUser, playerPosition);
          setPurchaseValue(1);
        }}
      >
        ADD
      </button>
      <ul>{buildList(searchedPlayers.length > 0 ? searchedPlayers : list)}</ul>
    </div>
  );
};
