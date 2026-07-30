import { Link, Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
    <nav
      style={{
        minWidth: 180,
        background: '#f2f2f2',
        padding: 16,
        boxSizing: 'border-box',
        borderRight: '1px solid #ddd',
      }}
    >
      <ul style={{ listStyle: 'none', padding: 0 }}>
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
    <main style={{ flex: 1, padding: 24 }}>
      <Outlet />
    </main>
  </div>
);

export default Layout;
