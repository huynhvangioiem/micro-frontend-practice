import './App.css';
import UserBadge from './components/UserBadge';

// Standalone dev page for this remote (localhost:3002).
// The host does not render this — it imports the exposed modules directly.
const App = () => {
  return (
    <div className="content">
      <h2>remote-user (standalone)</h2>
      <UserBadge />
    </div>
  );
};

export default App;
