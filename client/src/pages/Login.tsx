import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, loading }] = useMutation(LOGIN);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await login({ variables: { ...formState } });
      Auth.login(data.login.token);
    } catch (submitError) {
      console.error(submitError);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Pull up a chair</span>
        <h1>Welcome back.</h1>
        <p>Log in to get back to the recipes and cooks you love.</p>
        <form onSubmit={handleFormSubmit}>
          <label>Email
            <input name="email" type="email" autoComplete="email" value={formState.email} onChange={handleChange} required />
          </label>
          <label>Password
            <input name="password" type="password" autoComplete="current-password" value={formState.password} onChange={handleChange} required />
          </label>
          {error && <div className="form-error" role="alert">{error.message}</div>}
          <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
        </form>
        <div className="auth-switch">New to the table? <Link to="/signup">Create an account</Link></div>
      </section>
    </main>
  );
};

export default Login;
