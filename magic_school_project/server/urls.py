from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.user_list_view, name='user-list'),
    path('users/<int:pk>/', views.user_detail_view, name='user-detail'),
    path('courses/', views.course_list_view, name='course-list'),
    path('courses/<int:pk>/', views.course_detail_view, name='course-detail'),
    path('students/<int:pk>/courses/', views.my_courses, name='enrolled-courses'),
    path('teacher/<int:pk>/courses/', views.teacher_courses, name='teacher-courses'),
    path('courses/<int:course_id>/enroll/', views.enroll_student, name='enroll-student'),
]