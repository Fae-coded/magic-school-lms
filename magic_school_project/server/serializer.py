from rest_framework import serializers
from .models import Course, User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password

# Serializer for User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','first_name', 'email', 'role', 'id']
        
#Serializer for user registration
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate_email(self, value):
      if User.objects.filter(email=value).exists():
          raise serializers.ValidationError("Email already exists.")
      return value
      
    def validate_password(self, value):
        validate_password(value)
        return value  
    
    #   if len(value['password']) < 8:
    #       raise serializers.ValidationError("Password must be at least 8 characters long.")

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password = password, **validated_data)

# Serializer for user login
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        user = authenticate(username=username, password=password)
        
        if user and user.is_active:
            return {"user": user}
        raise serializers.ValidationError("Invalid credentials.")

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
