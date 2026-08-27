from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationView, UserLoginView, UserProfileViewSet,
    CourseViewSet, EnrollmentViewSet, ForumPostViewSet, ForumCommentViewSet,
    AchievementViewSet, UserAchievementViewSet, GoalViewSet, ProgressLogViewSet
)

router = DefaultRouter()
router.register(r'auth/register', UserRegistrationView, basename='register')
router.register(r'auth/login', UserLoginView, basename='login')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'forum/posts', ForumPostViewSet, basename='forum-post')
router.register(r'forum/comments', ForumCommentViewSet, basename='forum-comment')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'user-achievements', UserAchievementViewSet, basename='user-achievement')
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'progress', ProgressLogViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
]
