import React, { useEffect, useState } from 'react';
import { courseAPI, enrollmentAPI } from '../services/api';
import './Resources.css';

const Resources = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, [selectedCategory]);

  const loadCourses = async () => {
    try {
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await courseAPI.getAll(filters);
      setCourses(response.data);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseAPI.enroll(courseId);
      alert('Successfully enrolled!');
    } catch (err) {
      alert('Failed to enroll: ' + err.response?.data?.message);
    }
  };

  const categories = ['all', 'academic', 'skills', 'productivity', 'leadership', 'communication'];

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h1>📚 Learning Resources</h1>
        <p>Explore courses to improve your academic and social skills</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading courses...</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="resource-card">
              {course.image && <img src={course.image} alt={course.title} className="course-image" />}
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="category-badge">{course.category}</p>
                <p className="description">{course.description.substring(0, 100)}...</p>
                <div className="course-meta">
                  <span>📅 {course.duration_weeks} weeks</span>
                  <span>📊 {course.difficulty}</span>
                  <span>👥 {course.students_enrolled} students</span>
                </div>
                <button className="btn-primary" onClick={() => handleEnroll(course.id)}>
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
