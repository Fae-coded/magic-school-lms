from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('users/', views.user_list_view, name='user-list'),
    path('user/', views.user_detail_view, name='user-detail'),
    path('courses/', views.course_list_view, name='course-list'),
    path('courses/<int:pk>/', views.course_detail_view, name='course-detail'),
    path('students/courses/', views.my_courses, name='enrolled-courses'),
    path('teacher/courses/', views.teacher_courses, name='teacher-courses'),
    path('courses/<int:course_id>/enroll/', views.enroll_student, name='enroll-student'),
]