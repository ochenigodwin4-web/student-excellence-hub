import React, { useEffect, useState } from 'react';
import { profileAPI, enrollmentAPI, goalAPI, achievementAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const profileRes = await profileAPI.getMe();
      setProfile(profileRes.data);

      const enrollmentsRes = await enrollmentAPI.getAll();
      setEnrollments(enrollmentsRes.data);

      const goalsRes = await goalAPI.getAll();
      setGoals(goalsRes.data);

      const achievementsRes = await achievementAPI.getMyAchievements();
      setAchievements(achievementsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {profile?.user?.first_name || 'Student'}! 👋</h1>
        <div className="user-stats">
          <div className="stat-card">
            <h3>Level {profile?.level}</h3>
            <p>{profile?.points} Points</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Enrolled Courses */}
        <section className="dashboard-section">
          <h2>📚 My Courses</h2>
          <div className="courses-list">
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <div key={enrollment.id} className="course-card">
                  <h3>{enrollment.course.title}</h3>
                  <p>{enrollment.course.category}</p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                  <p>{Math.round(enrollment.progress)}% Complete</p>
                </div>
              ))
            ) : (
              <p>No courses enrolled yet</p>
            )}
          </div>
        </section>

        {/* Goals */}
        <section className="dashboard-section">
          <h2>🎯 My Goals</h2>
          <div className="goals-list">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="goal-card">
                  <h3>{goal.title}</h3>
                  <p>Status: <span className={`status ${goal.status}`}>{goal.status}</span></p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                  <p>{Math.round(goal.progress)}% Progress</p>
                </div>
              ))
            ) : (
              <p>No goals set yet</p>
            )}
          </div>
        </section>

        {/* Achievements */}
        <section className="dashboard-section">
          <h2>🏆 Achievements</h2>
          <div className="achievements-grid">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card">
                  <img src={achievement.achievement.icon} alt={achievement.achievement.title} />
                  <h3>{achievement.achievement.title}</h3>
                  <p>+{achievement.achievement.points} Points</p>
                </div>
              ))
            ) : (
              <p>No achievements yet</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
