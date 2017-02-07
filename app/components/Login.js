import React, { Component, PropTypes } from 'react';
import styles from './Login.css';

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired
  };

  handleLogin() {
    const { onLogin } = this.props;
    const username = this.refs.username.value;

    onLogin({ username, loggedIn: true });

    this.props.router.push('/loggedin');
  }

  render() {
    return (
      <div className={styles.container}>
        <h2>Login</h2>
        <input ref="username" type="text" />
        <button onClick={::this.handleLogin}>Log In</button>
      </div>
    );
  }
}
