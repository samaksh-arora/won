import React from 'react';
import { Link } from 'react-router-dom';

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-card-info">
          <h3 className="profile-card-name">{user.name}</h3>
          <p className="profile-card-major">{user.major}</p>
          {user.year && <p className="profile-card-year">Year: {user.year}</p>}
        </div>
      </div>

      <div className="profile-card-body">
        {user.currentInternship && (
          <div className="profile-detail">
            <strong>Current Internship:</strong>
            <p>{user.currentInternship}</p>
          </div>
        )}

        {user.previousInternships && user.previousInternships.length > 0 && (
          <div className="profile-detail">
            <strong>Previous Internships:</strong>
            <ul className="internship-list">
              {user.previousInternships.slice(0, 2).map((internship, idx) => (
                <li key={idx}>{internship}</li>
              ))}
            </ul>
          </div>
        )}

        {user.skills && user.skills.length > 0 && (
          <div className="profile-detail">
            <strong>Skills:</strong>
            <div className="skills-container">
              {user.skills.slice(0, 5).map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="profile-card-footer">
        <Link to={`/profile/${user._id}`} className="btn-view-profile">
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
