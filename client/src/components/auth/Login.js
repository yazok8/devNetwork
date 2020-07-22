import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Success!');
  };

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign Ip</h1>

        <p className="lead">
          <i className="fas fa-user"></i> Sign into your account
        </p>
        <form onSubmit={(e) => onSubmit(e)} className="form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              minlength="6"
              value={password}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input
            type="submit"
            placeholder="Submit"
            value="Login"
            className="btn btn-primary"
          />
        </form>

        <p className="my-1">
          Don't have an account? <Link to="/login">Sign Up</Link>
        </p>
      </section>
    </Fragment>
  );
};

export default Login;
