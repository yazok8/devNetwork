import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
  experience: { company, title, location, current, to, from, description },
}) => (
  <div>
    <h3 className="text-dark">{company}</h3>

    <p>
      <Moment format="YYYY/MM/DD">{from}</Moment>-
      {!to ? 'Now' : <Moment format="YYYY/MM/DD">{to}</Moment>}
    </p>

    <strong>Position:</strong>
    {title}
    <br />
    <strong>description:</strong>
    {description}
  </div>
);
ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired,
};

export default ProfileExperience;
