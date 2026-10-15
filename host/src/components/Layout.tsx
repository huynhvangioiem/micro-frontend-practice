import { Link, Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="app-layout">
    <nav className="app-nav">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cart">Cart Widget</Link>
        </li>
        <li>
          <Link to="/user">User Badge</Link>
        </li>
      </ul>
    </nav>
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);

export default Layout;
