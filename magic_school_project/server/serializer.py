from rest_framework import serializers
from .models import Course, User

# Serializer for User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'role', 'id']

# Serializer for Course model including enrolled students
class CourseSerializer(serializers.ModelSerializer):
    enrolled_students = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'course_title', 'course_description', 'teacher', 'enrolled_students']

# Serializer for listing a student's enrolled courses
class StudentCoursesSerializer(serializers.ModelSerializer):
     courses = CourseSerializer(many=True, read_only=True)
    
     class Meta:
        model = User
        fields = ['id', 'username', 'courses']

# Handles user creation with password hashing        
# class UserCreateSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)
    
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password', 'role']
    
#     def create(self, validated_data):
#         user = User.objects.create_user(**validated_data)
#         return user
