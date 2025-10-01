import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/profileService';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const isOwnProfile = !userId || userId === currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    major: '',
    year: '',
    currentInternship: '',
    previousInternships: '',
    skills: '',
    interests: '',
    bio: '',
    linkedIn: '',
    isPublic: true,
  });

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile(userId);
      setProfile(data);
      if (isOwnProfile) {
        setFormData({
          name: data.name || '',
          major: data.major || '',
          year: data.year || '',
          currentInternship: data.currentInternship || '',
          previousInternships: data.previousInternships?.join(', ') || '',
          skills: data.skills?.join(', ') || '',
          interests: data.interests?.join(', ') || '',
          bio: data.bio || '',
          linkedIn: data.linkedIn || '',
          isPublic: data.isPublic !== undefined ? data.isPublic : true,
        });
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSubmit = {
        ...formData,
        previousInternships: formData.previousInternships
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item),
        skills: formData.skills
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item),
        interests: formData.interests
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item),
      };

      const updatedProfile = await updateProfile(dataToSubmit);
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (error && !profile) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-header-info">
          <h1>{profile?.name}</h1>
          <p className="profile-email">{profile?.email}</p>
        </div>
        {isOwnProfile && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="major">Major</label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <select id="year" name="year" value={formData.year} onChange={handleChange}>
                <option value="">Select Year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="currentInternship">Current Internship</label>
              <input
                type="text"
                id="currentInternship"
                name="currentInternship"
                value={formData.currentInternship}
                onChange={handleChange}
                placeholder="Company Name - Position"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="previousInternships">Previous Internships (comma-separated)</label>
            <input
              type="text"
              id="previousInternships"
              name="previousInternships"
              value={formData.previousInternships}
              onChange={handleChange}
              placeholder="Company 1 - Position, Company 2 - Position"
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills (comma-separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="JavaScript, Python, React, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="interests">Interests (comma-separated)</label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="Machine Learning, Web Development, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedIn">LinkedIn Profile URL</label>
            <input
              type="url"
              id="linkedIn"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              Make my profile public (visible in search results)
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-section">
            <h2>Academic Information</h2>
            <div className="profile-details">
              <div className="detail-item">
                <strong>Major:</strong>
                <span>{profile?.major}</span>
              </div>
              {profile?.year && (
                <div className="detail-item">
                  <strong>Year:</strong>
                  <span>{profile?.year}</span>
                </div>
              )}
            </div>
          </div>

          {profile?.bio && (
            <div className="profile-section">
              <h2>About</h2>
              <p>{profile.bio}</p>
            </div>
          )}

          {(profile?.currentInternship || profile?.previousInternships?.length > 0) && (
            <div className="profile-section">
              <h2>Internship Experience</h2>
              {profile?.currentInternship && (
                <div className="detail-item">
                  <strong>Current:</strong>
                  <span>{profile.currentInternship}</span>
                </div>
              )}
              {profile?.previousInternships?.length > 0 && (
                <div className="detail-item">
                  <strong>Previous:</strong>
                  <ul className="detail-list">
                    {profile.previousInternships.map((internship, idx) => (
                      <li key={idx}>{internship}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {profile?.skills?.length > 0 && (
            <div className="profile-section">
              <h2>Skills</h2>
              <div className="tags-container">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile?.interests?.length > 0 && (
            <div className="profile-section">
              <h2>Interests</h2>
              <div className="tags-container">
                {profile.interests.map((interest, idx) => (
                  <span key={idx} className="tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(profile?.linkedIn || profile?.email) && (
            <div className="profile-section">
              <h2>Contact</h2>
              <div className="contact-links">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="contact-link">
                    📧 Email
                  </a>
                )}
                {profile?.linkedIn && (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    💼 LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
