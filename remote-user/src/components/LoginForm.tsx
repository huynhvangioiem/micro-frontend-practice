import { useState, type FormEvent } from 'react';
import { DEMO_ACCOUNT } from '../store/authStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import './LoginForm.css';

type LoginFormProps = {
  /** Called after a successful login, e.g. to navigate back to where the user came from. */
  onSuccess?: () => void;
};

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login } = useCurrentUser();
  const [email, setEmail] = useState(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <p className="login-form__lede">Sign in to check out. Your cart stays as it is.</p>
      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error && (
        <p className="login-form__error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="login-form__hint">
        Demo account: <code>{DEMO_ACCOUNT.email}</code> / <code>{DEMO_ACCOUNT.password}</code>
      </p>
    </form>
  );
};

export default LoginForm;
