from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from .models import (
    UserProfile, Course, Lesson, Enrollment, Achievement, UserAchievement,
    ForumPost, ForumComment, Goal, ProgressLog
)
from .serializers import (
    UserSerializer, UserProfileSerializer, CourseSerializer, LessonSerializer,
    EnrollmentSerializer, AchievementSerializer, UserAchievementSerializer,
    ForumPostSerializer, ForumCommentSerializer, GoalSerializer, ProgressLogSerializer
)


# Authentication Views
class UserRegistrationView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Create UserProfile
        UserProfile.objects.create(user=user, role='student')
        
        # Create token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)


class UserLoginView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'user': UserSerializer(user).data,
                    'token': token.key,
                    'profile': UserProfileSerializer(user.userprofile).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# User Profile Views
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        try:
            profile = request.user.userprofile
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        profile = self.get_object()
        enrollments = profile.enrollments.all()
        goals = profile.goals.all()
        achievements = profile.achievements.all()
        
        return Response({
            'profile': UserProfileSerializer(profile).data,
            'enrollments': EnrollmentSerializer(enrollments, many=True).data,
            'goals': GoalSerializer(goals, many=True).data,
            'achievements': UserAchievementSerializer(achievements, many=True).data,
            'total_points': profile.points,
            'level': profile.level
        })


# Course Views
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['category', 'difficulty']
    search_fields = ['title', 'description']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        user_profile = request.user.userprofile
        
        enrollment, created = Enrollment.objects.get_or_create(
            user=user_profile,
            course=course
        )
        
        if created:
            course.students_enrolled += 1
            course.save()
            return Response(
                {'message': 'Successfully enrolled', 'enrollment': EnrollmentSerializer(enrollment).data},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'message': 'Already enrolled', 'enrollment': EnrollmentSerializer(enrollment).data},
                status=status.HTTP_200_OK
            )

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        course = self.get_object()
        lessons = course.lessons.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)


# Enrollment Views
class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user.userprofile)

    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        enrollment = self.get_object()
        progress = request.data.get('progress', 0)
        
        enrollment.progress = min(progress, 100)
        if enrollment.progress == 100:
            enrollment.completed = True
            enrollment.completed_at = timezone.now()
        enrollment.save()
        
        return Response(EnrollmentSerializer(enrollment).data)


# Forum Views
class ForumPostViewSet(viewsets.ModelViewSet):
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['category']
    search_fields = ['title', 'content']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.userprofile)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes += 1
        post.save()
        return Response({'likes': post.likes})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, pk=None):
        post = self.get_object()
        content = request.data.get('content')
        
        comment = ForumComment.objects.create(
            post=post,
            author=request.user.userprofile,
            content=content
        )
        
        return Response(ForumCommentSerializer(comment).data, status=status.HTTP_201_CREATED)


class ForumCommentViewSet(viewsets.ModelViewSet):
    queryset = ForumComment.objects.all()
    serializer_class = ForumCommentSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        comment = self.get_object()
        comment.likes += 1
        comment.save()
        return Response({'likes': comment.likes})


# Achievement Views
class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [AllowAny]


class UserAchievementViewSet(viewsets.ModelViewSet):
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user.userprofile)


# Goal Views
class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user.userprofile)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.userprofile)

    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        goal = self.get_object()
        progress = request.data.get('progress', 0)
        
        goal.progress = min(progress, 100)
        if goal.progress == 100:
            goal.status = 'completed'
            goal.completed_at = timezone.now()
        goal.save()
        
        return Response(GoalSerializer(goal).data)


# Progress Tracking Views
class ProgressLogViewSet(viewsets.ModelViewSet):
    queryset = ProgressLog.objects.all()
    serializer_class = ProgressLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProgressLog.objects.filter(user=self.request.user.userprofile)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.userprofile)

    @action(detail=False, methods=['get'])
    def weekly_stats(self, request):
        user_profile = request.user.userprofile
        seven_days_ago = timezone.now() - timedelta(days=7)
        
        logs = ProgressLog.objects.filter(
            user=user_profile,
            logged_at__gte=seven_days_ago
        )
        
        total_time = sum([log.time_spent_minutes for log in logs])
        lessons_completed = logs.filter(completed=True).count()
        avg_score = logs.filter(quiz_score__isnull=False).aggregate(
            avg=models.Avg('quiz_score')
        )['avg'] or 0
        
        return Response({
            'total_time_minutes': total_time,
            'lessons_completed': lessons_completed,
            'average_score': avg_score
        })
