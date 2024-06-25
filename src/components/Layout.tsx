import { useCallback } from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  const onEmpty = useCallback(() => {
    fetch("http://localhost:3000/api/empty", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

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

      <Outlet />
      <button onClick={onEmpty}>EMPTY</button>
    </>
  );
};

export default Layout;
