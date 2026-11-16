import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [addUser, { error, loading }] = useMutation(ADD_USER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await addUser({ variables: { input: { ...formState } } });
      Auth.login(data.addUser.token);
    } catch (submitError) {
      console.error(submitError);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">There’s always room for one more</span>
        <h1>Join the table.</h1>
        <p>Create an account to save, share, and vote for the recipes you love.</p>
        <form onSubmit={handleFormSubmit}>
          <label>Your name
            <input name="username" autoComplete="username" value={formState.username} onChange={handleChange} required />
          </label>
          <label>Email
            <input name="email" type="email" autoComplete="email" value={formState.email} onChange={handleChange} required />
          </label>
          <label>Password
            <input name="password" type="password" autoComplete="new-password" value={formState.password} onChange={handleChange} required />
          </label>
          {error && <div className="form-error" role="alert">{error.message}</div>}
          <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create my account'}</button>
        </form>
        <div className="auth-switch">Already have an account? <Link to="/login">Log in</Link></div>
      </section>
    </main>
  );
};

export default Signup;
