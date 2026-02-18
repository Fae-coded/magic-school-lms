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

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password = password, **validated_data)

# Serializer for user login
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        user = authenticate(
            username=attrs.get("username"),
            password=attrs.get("password")
        )
        
        if user is None:
            raise serializers.ValidationError("Invalid credentials.")
        return {"user": user}

# Serializer for Course model including enrolled students
class CourseSerializer(serializers.ModelSerializer):
    enrolled_students = UserSerializer(many=True, read_only=True)
    teacher = serializers.PrimaryKeyRelatedField(read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'course_title', 'course_description', 'teacher', 'enrolled_students', 'is_enrolled']
        
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        
        if not request or not request.user.is_authenticated:
            return False
        
        return obj.enrolled_students.filter(id=request.user.id).exists()

# Serializer for listing a student's enrolled courses
class StudentCoursesSerializer(serializers.ModelSerializer):
     courses = CourseSerializer(many=True, read_only=True)
    
     class Meta:
        model = User
        fields = ['id', 'username', 'courses']
