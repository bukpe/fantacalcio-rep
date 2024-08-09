import { useCallback, useState } from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  const [key, setKey] = useState<number>(0);
  const onEmpty = useCallback(() => {
    fetch("http://localhost:3000/api/empty", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      const newKey = key + 1;
      setKey(newKey);
    });
  }, [key]);

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/goalkeepers">Goalkeepers</Link>
          </li>
          <li>
            <Link to="/defenders">Defenders</Link>
          </li>
          <li>
            <Link to="/midfielders">Midfielders</Link>
          </li>
          <li>
            <Link to="/strikers">Strikers</Link>
          </li>
          <li>
            <Link to="/team">Team</Link>
          </li>
        </ul>
      </nav>

      <Outlet key={key} />
      <button onClick={onEmpty}>EMPTY</button>
    </>
  );
};

export default Layout;
