import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Search, TrendingUp, UserPlus, UserCheck } from 'lucide-react';
import './RightPanel.css';

const RightPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const navigate = useNavigate();

  // Fetch suggested users & trending hashtags
  useEffect(() => {
    const fetchPanelData = async () => {
      try {
        const [suggestedRes, trendingRes] = await Promise.all([
          API.get('/users/suggested'),
          API.get('/posts/hashtags/trending'),
        ]);
        setSuggestedUsers(suggestedRes.data.data || []);
        setTrendingTags(trendingRes.data.data || []);
      } catch (err) {
        console.error('Failed to load right panel data:', err.message);
      }
    };
    fetchPanelData();
  }, []);

  // Debounced search query handler
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const res = await API.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
          setSearchResults(res.data.data || []);
        } catch (err) {
          console.error('User search failed:', err.message);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleFollowToggle = async (userId) => {
    try {
      const res = await API.post(`/users/follow/${userId}`);
      setFollowingMap((prev) => ({
        ...prev,
        [userId]: res.data.isFollowing,
      }));
    } catch (err) {
      console.error('Follow request failed:', err.message);
    }
  };

  return (
    <aside className="right-panel">
      {/* Search Input Box */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search users or @username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="search-item"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  navigate(`/profile/${user.username}`);
                }}
              >
                <img
                  src={
                    user.profilePic ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`
                  }
                  alt={user.name}
                  className="search-avatar"
                />
                <div className="search-info">
                  <span className="search-name">{user.name}</span>
                  <span className="search-username">@{user.username}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Users */}
      <div className="panel-card">
        <h3 className="panel-title">Who to follow</h3>
        <div className="suggested-list">
          {suggestedUsers.length === 0 ? (
            <p className="empty-panel-text">No suggestions right now</p>
          ) : (
            suggestedUsers.map((u) => {
              const isFollowed = followingMap[u._id];
              return (
                <div key={u._id} className="user-card-row">
                  <div
                    className="user-profile-clickable"
                    onClick={() => navigate(`/profile/${u.username}`)}
                  >
                    <img
                      src={
                        u.profilePic ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=4F46E5&color=fff`
                      }
                      alt={u.name}
                      className="suggested-avatar"
                    />
                    <div className="suggested-info">
                      <span className="suggested-name">{u.name}</span>
                      <span className="suggested-username">@{u.username}</span>
                    </div>
                  </div>

                  <button
                    className={`btn btn-sm ${isFollowed ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleFollowToggle(u._id)}
                  >
                    {isFollowed ? <UserCheck size={14} /> : <UserPlus size={14} />}
                    <span>{isFollowed ? 'Following' : 'Follow'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Trending Hashtags */}
      <div className="panel-card">
        <h3 className="panel-title">
          <TrendingUp size={16} color="var(--accent-color)" /> Trending Hashtags
        </h3>
        <div className="trending-tags-list">
          {trendingTags.length === 0 ? (
            <p className="empty-panel-text">No trending hashtags yet</p>
          ) : (
            trendingTags.map((tag) => (
              <div
                key={tag._id}
                className="trending-tag-item"
                onClick={() => navigate(`/explore?tag=${tag._id}`)}
              >
                <span className="hashtag-name">#{tag._id}</span>
                <span className="hashtag-count">{tag.count} {tag.count === 1 ? 'post' : 'posts'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
