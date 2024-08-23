import { Outlet, Link } from "react-router-dom";

const Layout = () => {
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
    </>
  );
};

export default Layout;
