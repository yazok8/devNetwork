import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboardactions = ({profile}) => {
  const userId = profile?.user?._id;

  return (
    <div className="dash-button">
     {userId && (
        <Link to={`/profile/${userId}`} className="btn">
          <i className="fas fa-user-circle text-primary"></i> View Profile
        </Link>
      )}
      <Link to="/edit-profile" className="btn" style={{marginBlock: '10px'}}>
        <i className="fas fa-user-circle text-primary"></i> Edit Profile
      </Link>
      <Link to="/add-experience" className="btn">
        <i className="fab fa-black-tie text-primary"></i> Add Experience
      </Link>
      <Link to="/add-education" className="btn">
        <i className="fas fa-graduation-cap text-primary"></i> Add Education
      </Link>
    </div>
  );
};

