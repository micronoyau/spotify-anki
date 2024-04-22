import { useNavigate } from 'react-router-dom';
import { userLogin } from '../lib/backend-api';
import { USER_TOKEN_COOKIE } from '../lib/consts';
import { setCookie } from '../lib/cookie';
import './login-page.scss';

export function LoginPage() {
  const navigate = useNavigate();

  const handleUserLogin = async () => {
    const token = await userLogin();
    setCookie(USER_TOKEN_COOKIE, token);
    navigate('/home');
  }

  return (
    <div className="login-panel">
      <div className='user-login'>
        <h1>Login as a User :</h1>
        <button id="user-login-btn" onClick={handleUserLogin}>Login</button>
      </div>
    </div>
  );
}
