import type { ReactNode } from 'react';

export type AppName = 'host' | 'remote_catalog' | 'remote_cart' | 'remote_user';

export const APPS: Record<AppName, { port: number }> = {
  host: { port: 3000 },
  remote_catalog: { port: 3020 },
  remote_cart: { port: 3010 },
  remote_user: { port: 3002 },
};

export const appUrl = (app: AppName) => `http://localhost:${APPS[app].port}`;

type OriginProps = {
  app: AppName;
  /** What in this region comes from `app`, e.g. the exposed module name. */
  note?: string;
  /** Hug the content instead of filling the row (header widgets). */
  inline?: boolean;
  children: ReactNode;
};

/**
 * Marks a region of the page with the app it comes from. It only renders a visible
 * outline and label while the "Show app boundaries" switch is on (see App.css).
 */
const Origin = ({ app, note, inline = false, children }: OriginProps) => {
  const label = `${app} :${APPS[app].port}${note ? ` · ${note}` : ''}`;

  return (
    <div className={`origin origin--${app}${inline ? ' origin--inline' : ''}`}>
      <span className="origin__label">{label}</span>
      {children}
    </div>
  );
};

export default Origin;
