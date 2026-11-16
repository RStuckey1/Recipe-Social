import { Link, useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddIcon from '@mui/icons-material/Add';
import Auth from '../../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const username = Auth.loggedIn() ? Auth.getProfile().data.username : '';

  const logout = () => {
    Auth.logout();
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Gastro Book home">
          <span className="brand-mark"><AutoAwesomeIcon /></span>
          <span className="brand-name">gastro<span>book</span><small>Recipes worth sharing</small></span>
        </Link>
        <nav className="header-nav" aria-label="Main navigation">
          <Link to="/">Discover</Link>
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile">My kitchen</Link>
              <button className="header-user" type="button" onClick={() => navigate('/profile')}>
                <span className="avatar avatar-small">{username.charAt(0).toUpperCase()}</span>
                <span>{username}</span>
              </button>
              <button className="header-login" type="button" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link className="button button-primary header-cta" to="/signup"><AddIcon fontSize="small" /> Join the table</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
