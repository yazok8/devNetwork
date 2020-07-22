import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log('passwords do not match');
    } else {
      console.log(formData);
    }
  };

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign Up</h1>

        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <form onSubmit={(e) => onSubmit(e)} className="form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
            <small className="form-text">
              This site uses Gravatar, so if you want a profile image, use a
              gravatar email.
            </small>
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
          <div className="form-group">
            <input
              type="password"
              name="password2"
              value={password2}
              placeholder="Confirm Password"
              minlength="6"
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input
            type="submit"
            placeholder="Submit"
            value="Register"
            className="btn btn-primary"
          />
        </form>

        <p className="my-1">
          Already have an account?<Link to="/login">Sign In</Link>
        </p>
      </section>
    </Fragment>
  );
};

export default Register;
