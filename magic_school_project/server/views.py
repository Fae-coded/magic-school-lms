from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from .models import Course, User
from .serializer import CourseSerializer, UserSerializer, StudentCoursesSerializer

# View to list all users.
@api_view(['GET'])
def UserListView(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
# View to get a user to update or delete if user is an admin.


# View to list all courses and create a new course.
@api_view(['GET', 'POST'])
def courseListView(request):
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
class CourseDetailView(APIView):
    def get_object(self, pk):
        try:
            return Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return None

    def put(self, request, pk):
        course = self.get_object(pk)
        if course is None:
            return Response({'error': 'Course not found.'}, status=404)
        
        if request.user.role in [User.Role.TEACHER, User.Role.ADMIN]:
            serializer = CourseSerializer(course, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'Only teachers and admins can update courses.'}, status=403)

    def delete(self, request, pk):
        course = self.get_object(pk)
        if course is None:
            return Response({'error': 'Course not found.'}, status=404)
        
        if request.user.role in [User.Role.TEACHER, User.Role.ADMIN]:
            course.delete()
            return Response(status=204)
        else:
            return Response({'error': 'Only teachers and admins can delete courses.'}, status=403)

# View to get enrolled courses for the logged-in student
@api_view(['GET'])
def my_courses(request):
    serializer = StudentCoursesSerializer(request.user)
    return Response(serializer.data)

# View to enroll a student in a course?

# View to get all of a teacher's courses
@api_view(['GET'])
def teacher_courses(request):
    courses = Course.objects.filter(teacher=request.user)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)