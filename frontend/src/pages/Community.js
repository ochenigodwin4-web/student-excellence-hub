import React, { useEffect, useState } from 'react';
import { forumAPI } from '../services/api';
import './Community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await forumAPI.getPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await forumAPI.createPost(newPost);
      setNewPost({ title: '', content: '', category: 'general' });
      setShowNewPostForm(false);
      loadPosts();
    } catch (err) {
      alert('Failed to create post');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await forumAPI.likePost(postId);
      loadPosts();
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  return (
    <div className="community-container">
      <div className="community-header">
        <h1>👥 Community Forum</h1>
        <p>Connect with other students, share experiences, and support each other</p>
        <button className="btn-primary" onClick={() => setShowNewPostForm(!showNewPostForm)}>
          {showNewPostForm ? 'Cancel' : '+ New Discussion'}
        </button>
      </div>

      {showNewPostForm && (
        <div className="new-post-form">
          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="study-tips">Study Tips</option>
                <option value="announcements">Announcements</option>
                <option value="events">Events</option>
              </select>
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows="5"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Post</button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="loading">Loading discussions...</p>
      ) : (
        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <span className="category-badge">{post.category}</span>
                </div>
                <p className="post-author">By {post.author.user.username}</p>
                <p className="post-content">{post.content.substring(0, 200)}...</p>
                <div className="post-stats">
                  <button className="stat-btn" onClick={() => handleLikePost(post.id)}>
                    👍 {post.likes} Likes
                  </button>
                  <span className="stat-btn">💬 {post.comments.length} Comments</span>
                  <span className="stat-btn">👁️ {post.views} Views</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-posts">No discussions yet. Be the first to start one!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Community;
