from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import Course, User
from .serializer import *

# View to register a new user.
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "user": serializer.data,
        "tokens": {
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }
    }, status=status.HTTP_201_CREATED)

# View to login a user.
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role},
        "tokens": {
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }
    }, status=status.HTTP_200_OK)
    
# View to logout a user.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    refresh_token = request.data.get("refresh")
    
    if not refresh_token:
        return Response(
            {"error": "Refresh token is required."},
            status=status.HTTP_400_BAD_REQUEST)
    
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# View to list all users.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list_view(request):
    if request.method == 'GET':
        if request.user.role != User.Role.ADMIN:
          return Response(
            {"error": "Only admins can view users."},
            status=403
        )
          
        users = User.objects.exclude(role=User.Role.ADMIN)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

# View to get a user to update or delete if requesting user is an admin.
@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail_view(request, pk):
    if request.user.role != User.Role.ADMIN:
        return Response({"error": "Admins only"}, status=403)
    
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = UserSerializer(user, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=204)


# View to list all courses and create a new course.
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def course_list_view(request):   
    if request.method == 'GET':
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)
    
    # Create a new course if the user is a teacher or admin.
    elif request.method == 'POST':
        if request.user.role not in [User.Role.TEACHER, User.Role.ADMIN]:
          return Response({'error': 'Only teachers and admins can create courses.'}, status=403)

        serializer = CourseSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(teacher=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
    
# View to update or delete a course if the user is a teacher or admin.
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def course_detail_view(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=404)

    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if request.user == course.teacher or request.user.role == User.Role.ADMIN:
            serializer = CourseSerializer(course, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'Only the teacher or an admin can update this course.'}, status=403)

    elif request.method == 'DELETE':
        if request.user == course.teacher or request.user.role == User.Role.ADMIN:
            course.delete()
            return Response(status=204)
        else:
            return Response({'error': 'Only the teacher or an admin can delete this course.'}, status=403)

# View to enroll a student in a course
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_student(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=404)
    if request.user.role == User.Role.STUDENT:
        if request.user in course.enrolled_students.all():
            return Response({'error': 'Student already enrolled in this course.'}, status=400)
        else:
          course.enrolled_students.add(request.user)
          return Response({'message': 'Student enrolled successfully!'}, status=200)
    else:
        return Response({'error': 'Only students can enroll in courses.'}, status=403)

# View to get enrolled courses for the logged-in student
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_courses(request):
    serializer = StudentCoursesSerializer(request.user, context={'request': request})
    return Response(serializer.data)

# View to get all of a teacher's courses
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_courses(request):
    courses = Course.objects.filter(teacher=request.user)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)