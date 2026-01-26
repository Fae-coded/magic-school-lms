from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Course, User
from .serializer import CourseSerializer, UserSerializer, StudentCoursesSerializer

# View to list all users.
@api_view(['GET'])
def user_list_view(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

# View to get a user to update or delete if requesting user is an admin.
@api_view(['GET', 'PUT', 'DELETE'])
def user_detail_view(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if request.user.role == User.Role.ADMIN:
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'Only admins can update users.'}, status=403)

    elif request.method == 'DELETE':
        if request.user.role == User.Role.ADMIN:
            user.delete()
            return Response(status=204)
        else:
            return Response({'error': 'Only admins can delete users.'}, status=403)


# View to list all courses and create a new course.
@api_view(['GET', 'POST'])
def course_list_view(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    
    # Create a new course if the user is a teacher or admin.
    elif request.method == 'POST':
        if request.user.role in [User.Role.TEACHER, User.Role.ADMIN]:
            serializer = CourseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'Only teachers and admins can create courses.'}, status=403)
    
# View to update or delete a course if the user is a teacher or admin.
@api_view(['GET', 'PUT', 'DELETE'])
def course_detail_view(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=404)

    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if request.user.role in [User.Role.TEACHER, User.Role.ADMIN]:
            serializer = CourseSerializer(course, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'Only teachers and admins can update courses.'}, status=403)

    elif request.method == 'DELETE':
        if request.user.role in [User.Role.TEACHER, User.Role.ADMIN]:
            course.delete()
            return Response(status=204)
        else:
            return Response({'error': 'Only teachers and admins can delete courses.'}, status=403)

# View to enroll a student in a course?
# @api_view(['POST'])
# def enroll_student(request, course_id):
    
    #if request.user.role == user.role.STUDENT:
    #also check if student already enrolled.


# View to get enrolled courses for the logged-in student
@api_view(['GET'])
def my_courses(request):
    serializer = StudentCoursesSerializer(request.user)
    return Response(serializer.data)

# View to get all of a teacher's courses
@api_view(['GET'])
def teacher_courses(request):
    courses = Course.objects.filter(teacher=request.user)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)