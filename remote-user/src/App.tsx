import './tokens.css';
import './App.css';
import LoginForm from './components/LoginForm';
import UserBadge from './components/UserBadge';
import { useCurrentUser } from './hooks/useCurrentUser';

// Standalone dev page for this remote (localhost:3002).
// The host does not render this — it imports the exposed modules directly.
const App = () => {
  const { user } = useCurrentUser();

  return (
    <div className="content">
      <h2>remote-user (standalone)</h2>
      {user ? <UserBadge /> : <LoginForm />}
    </div>
  );
};

export default App;
