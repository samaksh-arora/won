import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/ProfileCard';
import { searchProfiles, getAllProfiles } from '../services/profileService';

const SearchResults = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const fetchAllProfiles = async () => {
    setLoading(true);
    try {
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (err) {
      setError('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async ({ searchTerm, filterType }) => {
    if (!searchTerm.trim()) {
      fetchAllProfiles();
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await searchProfiles(searchTerm, filterType);
      setProfiles(data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>Find Wayne State Students</h1>
        <p>Connect with peers who share your interests and goals</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : (
        <>
          {profiles.length === 0 ? (
            <div className="no-results">
              {hasSearched
                ? 'No students found matching your search.'
                : 'No profiles available yet.'}
            </div>
          ) : (
            <>
              <div className="results-count">
                {profiles.length} {profiles.length === 1 ? 'student' : 'students'} found
              </div>
              <div className="profiles-grid">
                {profiles.map((profile) => (
                  <ProfileCard key={profile._id} user={profile} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
