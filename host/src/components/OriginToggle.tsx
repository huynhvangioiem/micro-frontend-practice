import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tla-shop:show-origins';

function readInitial() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

/** Switch for the app-boundary outlines; on by default so a first-time viewer sees them. */
const OriginToggle = () => {
  const [on, setOn] = useState(readInitial);

  useEffect(() => {
    document.body.classList.toggle('show-origins', on);
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch {
      // Storage can be unavailable; the switch still works for this visit.
    }
  }, [on]);

  return (
    <label className="origin-toggle">
      <input type="checkbox" checked={on} onChange={(event) => setOn(event.target.checked)} />
      Show app boundaries
    </label>
  );
};

export default OriginToggle;
