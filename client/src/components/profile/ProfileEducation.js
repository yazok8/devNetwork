import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, current, to, from, description },
}) => (
  <div>
    <h3 className="text-dark">{school}</h3>
    <p>
      <Moment format="YYYY/MM/DD">{from}</Moment>-
      {!to ? 'Now' : <Moment format="YYYY/MM/DD">{to}</Moment>}
    </p>
    <strong> Degree: </strong>
    {degree}
    <br />
    <strong> Field Of Study: </strong>
    {fieldofstudy} <br />
    <strong> description: </strong>
    {description}
  </div>
);
ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired,
};

export default ProfileEducation;
