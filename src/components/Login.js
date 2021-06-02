import { useState, useRef } from 'react';
import axios from 'axios';
import { Room, Cancel } from '@material-ui/icons';
import './Login.css';

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);

  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userLogin = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        userLogin
      );

      myStorage.setItem('user', res.data.username);

      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        Marker Map
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus type="text" placeholder="username" ref={usernameRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>

        {error && <span className="fail">Login Fail, Check Again !</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Login;
