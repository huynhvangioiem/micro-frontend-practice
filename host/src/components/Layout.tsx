import { lazy } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { APPS, type AppName } from './Origin';
import OriginToggle from './OriginToggle';
import RemoteRoute from './RemoteRoute';

const CartBadge = lazy(() => import('remote_cart/CartBadge'));
const UserMenu = lazy(() => import('./UserMenu'));

const Layout = () => (
  <div className="app-layout">
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-brand">
          TLA<span>shop</span>
        </Link>
        <nav className="app-nav">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart" className="app-cart">
            <RemoteRoute name="Cart" compact app="remote_cart" note="CartBadge">
              <CartBadge />
            </RemoteRoute>
          </NavLink>
        </nav>
        <OriginToggle />
        <div className="app-user">
          <RemoteRoute name="Account" compact app="remote_user" note="useCurrentUser">
            <UserMenu />
          </RemoteRoute>
        </div>
      </div>
    </header>
    <div className="origin-legend">
      <span>App boundaries</span>
      {(Object.keys(APPS) as AppName[]).map((app) => (
        <span key={app} className={`origin-legend__item origin--${app}`}>
          {app === 'host' ? 'host (everything not outlined)' : `${app} :${APPS[app].port}`}
        </span>
      ))}
    </div>
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);

export default Layout;
