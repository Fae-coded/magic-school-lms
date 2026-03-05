from django.test import TestCase
from django.urls import reverse
from server.models import User, Course
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterAPITestCase(APITestCase):
    def setUp(self):        
        self.valid_payload = {
            'username': 'aidoneus',
            'email': 'aidoneus@strixhaven.com',
            'password': 'Odette!1'
        }
        
        self.invalid_payload = {
            'username': 'aidoneus',
            'password': 'Odette!69'
        }
        
        self.url = reverse('register')
        
    def register_user(self, payload):
        return self.client.post(self.url, payload, format='json')
        
    def test_create_user(self):
        response = self.register_user(self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        
    def test_register_sets_default_role_to_student(self):
        response = self.register_user(self.valid_payload)
        user = User.objects.get(username='aidoneus')
        self.assertEqual(user.role, User.Role.STUDENT)
        
    def test_password_is_hashed(self):
        response = self.register_user(self.valid_payload)
        user = User.objects.get(username='aidoneus')
        self.assertNotEqual(user.password, self.valid_payload['password'])
        self.assertTrue(user.check_password(self.valid_payload['password']))
        
    def test_response_contains_tokens_and_user_data(self):
        response = self.register_user(self.valid_payload)
        self.assertIn('tokens', response.data)
        self.assertIn('refresh', response.data['tokens'])
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['username'], 'aidoneus')
        self.assertEqual(response.data['user']['role'], User.Role.STUDENT)
        
    def test_create_user_without_email(self):
        response = self.register_user(self.invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)


class LoginAPITestCase(APITestCase):
    def setUp(self):        
        self.user = User.objects.create_user(
            username='aidoneus',
            email='aidoneus@strixhaven.com',
            password='Odette!69'
        )
        
        self.valid_payload = {
            'username': 'aidoneus',
            'password': 'Odette!69'
        }
        
        self.invalid_payload = {
            'username': 'aidoneus',
            'password': 'WrongPassword'
        }
        
        self.url = reverse('login')
        
    def login_user(self, payload):
        return self.client.post(self.url, payload, format='json')
    
    def test_login_user_success(self):
        response = self.login_user(self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_response_contains_tokens_and_user_data(self):
        response = self.login_user(self.valid_payload)
        self.assertIn('tokens', response.data)
        self.assertIn('refresh', response.data['tokens'])
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['username'], self.user.username)
        
    def test_login_with_wrong_password(self):
        response = self.login_user(self.invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_login_unregistered_user(self):
        payload = {
            'username': 'alexander',
            'password': 'ClamTime'
        }
        
        response = self.login_user(payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
class LogoutAPITestCase(APITestCase):
    def setUp(self):
        
        self.user = User.objects.create_user(
            username= 'aurelia',
            email='aurelia@strixhaven.com',
            password='FireHorse'
        )
        
        self.refresh = RefreshToken.for_user(self.user)
        
        self.client.force_authenticate(user=self.user)
        
        self.url = reverse('logout')
        
    def test_gets_refresh_token_and_blacklists_token(self):
        response = self.client.post(
            self.url,
            {"refresh": str(self.refresh)},
            format='json')
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)   
        
    def test_no_refresh_token_bad_request(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    
class UserListAPITestCase(APITestCase):
    def setUp(self):
        
        self.admin = User.objects.create_user(
            username= 'adminuser',
            email= 'admin@strixhaven.com',
            password= 'AdminPassword1',
            role= User.Role.ADMIN
        )
        
        self.teacher = User.objects.create_user(
            username= 'profvayran',
            email= 'vayran@strixhaven.com',
            password= 'Prismani',
            role= User.Role.TEACHER
        )
        
        self.student = User.objects.create_user(
            username= 'aurelia',
            email= 'aurelia@strixhaven.com',
            password= 'FireHorse',
            role= User.Role.STUDENT
        )
        
        self.url = reverse('user-list')
        
    def test_admin_can_get_users_list(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_teacher_can_not_get_users_list(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_student_can_not_get_users_list(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_unautenticated_can_not_access(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
class UserDetailAPITestCase(APITestCase):
    def setUp(self):     
        self.admin = User.objects.create_user(
            username= 'adminuser',
            email= 'admin@strixhaven.com',
            password= 'AdminPassword1',
            role= User.Role.ADMIN
        )
        
        self.teacher = User.objects.create_user(
            username= 'profvayran',
            email= 'vayran@strixhaven.com',
            password= 'Prismani',
            role= User.Role.TEACHER
        )
        
        self.student = User.objects.create_user(
            username= 'noskzarrosh',
            email= 'nosk@strixhaven.com',
            password= 'NineInchClaws',
            role= User.Role.STUDENT
        )
        
        self.user = User.objects.create(
            username = 'aidoneus',
            email = 'aidoneus@strixhaven.com',
            password = 'Odette!69',
            role = User.Role.STUDENT
        )
        
        self.url = reverse('user-detail', kwargs={'pk': self.user.pk})
        
    #GET request tests
    def test_admin_can_get_a_user(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
    
    def test_teacher_can_not_get_a_user(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_student_can_not_get_a_user(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_unauthorized_can_not_access(self):
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_admin_can_not_get_nonexistent_user(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('user-detail', kwargs={'pk': 300})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    #PATCH request tests    
    def test_admin_can_update_a_user(self):
        self.client.force_authenticate(user=self.admin)
        data = {
            'username': 'alexander',
            'email': 'alexander@strixhaven.com',
            'role': User.Role.TEACHER
            }
        response = self.client.patch(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'alexander')
        
    def test_teacher_can_not_update_a_user(self):
        self.client.force_authenticate(user=self.teacher)
        data = {'email': 'alexander@strixhaven.com'}
        response = self.client.patch(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_student_can_not_update_a_user(self):
        self.client.force_authenticate(user=self.student)
        data = {'role': User.Role.TEACHER}
        response = self.client.patch(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_unauthorized_can_not_update_user(self):
        data = {'username': 'alexander'}
        response = self.client.patch(self.url, data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    #DELETE request tests
    def test_admins_can_delete_a_user(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())
        
    def test_teacher_can_not_delete_a_user(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())
        
    def test_student_can_not_delete_a_user(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())
    
    def test_unauthorized_can_not_delete_user(self):
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        
class CourseListAPITestCase(APITestCase):
    def setUp(self):        
        self.admin = User.objects.create_user(
            username= 'adminuser',
            email= 'admin@strixhaven.com',
            password= 'AdminPassword1',
            role= User.Role.ADMIN
        )
        
        self.teacher = User.objects.create_user(
            username= 'profvayran',
            email= 'vayran@strixhaven.com',
            password= 'Prismani',
            role= User.Role.TEACHER
        )
        
        self.student = User.objects.create_user(
            username= 'zorisphinx',
            email= 'zori@strixhaven.com',
            password= 'ILoveStudying',
            role= User.Role.STUDENT
        )
        
        self.existing_course = Course.objects.create(
            course_title = 'Familiar Summoning and Care',
            course_description = 'Students will learn how to summon, care for, speak to a familiar and will receive one from the rescue shelter.',
            teacher= self.teacher
        )
        
        self.valid_course_payload = {
            "course_title" : "Magic Fundamentals of All Eight Schools",
            "course_description" : "Students will go over the foundations of magic, learn to meditate and will receive an increased Mana Pool."
        }    
        
        self.url = reverse('course-list')
                   
    def create_course(self, payload):
        return self.client.post(self.url, payload, format='json')

    #GET request tests        
    def test_registered_users_can_get_course_list(self):
        self.client.force_authenticate(user= self.admin)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_unauthenticated_users_can_not_get_course_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    #POST request tests
    def test_admin_can_create_course(self):
        self.client.force_authenticate(user= self.admin)
        response = self.create_course(self.valid_course_payload)   
             
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 2)
    
    def test_teacher_can_create_course(self):
        self.client.force_authenticate(user= self.teacher)
        response = self.create_course(self.valid_course_payload)
    
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_student_can_create_course(self):
        self.client.force_authenticate(user= self.student)
        response = self.create_course(self.valid_course_payload)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_unauthenticated_user_can_not_create_course(self):
        response = self.create_course(self.valid_course_payload)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)  
  
  
# get, put, delete course tests  url name course-detail
class CourseDetailAPITestCase(APITestCase):
    def setUp(self):     
        self.admin = User.objects.create_user(
            username= 'adminuser',
            email= 'admin@strixhaven.com',
            password= 'AdminPassword1',
            role= User.Role.ADMIN
        )
        
        self.teacher = User.objects.create_user(
            username= 'profvayran',
            email= 'vayran@strixhaven.com',
            password= 'Prismani',
            role= User.Role.TEACHER
        )
        
        self.other_teacher = User.objects.create_user(
            username= 'proflisette',
            email= 'lisette@strixhaven.com',
            password= 'WitherBloom',
            role= User.Role.TEACHER
        )
        
        self.student = User.objects.create_user(
            username= 'zorisphinx',
            email= 'zori@strixhaven.com',
            password= 'ILoveStudying',
            role= User.Role.STUDENT
        )
        
        self.course = Course.objects.create(
            course_title= 'Flame of Knowledge',
            course_description= 'Students will learn details events of Aracvios history.',
            teacher=self.teacher
        )
        
        self.url = reverse('course-detail', kwargs={'pk': self.course.pk})
        
    #GET request tests
    def test_authorized_user_can_get_a_course(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['course_title'], self.course.course_title)
    
    def test_unauthorized_can_not_access(self):
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_authorized_user_can_not_get_nonexistent_course(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('course-detail', kwargs={'pk': 300})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    #PUT request tests    
    def test_admin_can_update_a_course(self):
        self.client.force_authenticate(user=self.admin)
        data = {
            'course_title': 'Speaking the Same Language',
            'course_description': 'Students will learn how to solve common magical cyphers or use magic to comprehend text that is alien to them.',
            }
        response = self.client.put(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.course_title, 'Speaking the Same Language')
        
    def test_teacher_can_update_a_course(self):
        self.client.force_authenticate(user=self.teacher)
        data = {
            'course_title': 'Flame of Knowledge',
            'course_description': 'Students will learn details events of Aracvios history, or may spontaneously gain the breath of a Dragon.',
            }
        response = self.client.put(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.course_description, 'Students will learn details events of Aracvios history, or may spontaneously gain the breath of a Dragon.')
        
    def test_teacher_can_not_update_other_teachers_course(self):
        self.client.force_authenticate(user= self.other_teacher)
        data= {
            'course_title': 'S.T.E.M: Leafbinding for Beginners',
            'course_description': 'Students will either learn how to use magic to soothe and heal a wound or how to commune with Flora'
        }
        response = self.client.put(self.url, data, format= 'json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_student_can_not_update_a_course(self):
        self.client.force_authenticate(user=self.student)
        data = {
            'course_title': 'Lame Knowledge',
            'course_description': 'Learn about some boring old history.'
            }
        response = self.client.put(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_unauthorized_can_not_update_user(self):
        data = {'course_description': 'There is no course.'}
        response = self.client.put(self.url, data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    #DELETE request tests
    def test_admins_can_delete_a_course(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Course.objects.filter(pk=self.course.pk).exists())
        
    def test_teacher_can_delete_a_course(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Course.objects.filter(pk=self.course.pk).exists())
        
    def test_student_can_not_delete_a_course(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Course.objects.filter(pk=self.course.pk).exists())
    
    def test_unauthorized_can_not_delete_course(self):
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EnrolledCoursesAPITestCase(APITestCase):
    def setUp(self):
        self.student = User.objects.create_user(
            username= 'noskzarrosh',
            email= 'nosk@strixhaven.com',
            password= 'NineInchClaws',
            role= User.Role.STUDENT
        )
        
        self.other_student = User.objects.create_user(
            username= 'zorisphinx',
            email= 'zori@strixhaven.com',
            password= 'ILoveStudying',
            role= User.Role.STUDENT
        )
        
        self.teacher= User.objects.create_user(
            username= 'profbreena',
            email= 'breena@strixhaven.com',
            password= 'SilverQuill',
            role= User.Role.TEACHER
        )
        
        self.first_course = Course.objects.create(
            course_title = 'SLAM Poetry: Devastating Your Enemies with Magical Insults',
            course_description = 'Students will either learn how to taunt opponents, or actually cause harm via vicious mockery.',
            teacher=self.teacher
        )
        
        self.second_course = Course.objects.create(
            course_title = 'S.T.E.M: Leafbinding for Beginners',
            course_description = 'Students will either learn how to use magic to soothe and heal a wound or how to commune with Flora.',
            teacher=self.teacher
        )
        
        self.student.courses.add(self.first_course, self.second_course)
        
        self.url = reverse('enrolled-courses', )
        
    def test_student_gets_their_enrolled_courses(self):
        self.client.force_authenticate(user=self.student)
        response= self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['courses']), 2)
        
    def test_student_receives_correct_courses(self):
        self.client.force_authenticate(user=self.student)
        response= self.client.get(self.url)
        
        self.assertEqual(response.data['courses'][0]['course_title'], 'S.T.E.M: Leafbinding for Beginners')
        self.assertEqual(response.data['courses'][1]['course_title'], 'SLAM Poetry: Devastating Your Enemies with Magical Insults')
        
    def test_other_student_only_gets_their_enrolled_courses(self):
        self.client.force_authenticate(user= self.other_student)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['courses']), 0)
        
    def test_unauthenticated_user_cannot_access(self):
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

# get list of courses created by that teacher url name teacher-courses
class TeacherCoursesAPITestCase(APITestCase):
    def setUp(self):
        self.teacher= User.objects.create_user(
            username= 'profbreena',
            email= 'breena@strixhaven.com',
            password= 'SilverQuill',
            role= User.Role.TEACHER
        )
        
        self.other_teacher = User.objects.create_user(
            username= 'profvayran',
            email= 'vayran@strixhaven.com',
            password= 'Prismani',
            role= User.Role.TEACHER
        )
        
        self.first_course = Course.objects.create(
            course_title = 'SLAM Poetry: Devastating Your Enemies with Magical Insults',
            course_description = 'Students will either learn how to taunt opponents, or actually cause harm via vicious mockery.',
            teacher=self.teacher
        )
        
        self.second_course = Course.objects.create(
            course_title = 'S.T.E.M: Leafbinding for Beginners',
            course_description = 'Students will either learn how to use magic to soothe and heal a wound or how to commune with Flora.',
            teacher=self.teacher
        )
        
        self.url = reverse('teacher-courses', )
        
    def test_teacher_gets_their_courses(self):
        self.client.force_authenticate(user=self.teacher)
        response= self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_teacher_receives_correct_courses(self):
        self.client.force_authenticate(user=self.teacher)
        response= self.client.get(self.url)
        
        titles = [course['course_title']for course in response.data]
        
        self.assertIn('SLAM Poetry: Devastating Your Enemies with Magical Insults', titles)
        self.assertIn('S.T.E.M: Leafbinding for Beginners', titles)
        
        
    def test_other_teacher_only_gets_their_courses(self):
        self.client.force_authenticate(user= self.other_teacher)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
        
    def test_unauthenticated_user_cannot_access(self):
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

# post enrolls a student in a course url name enroll-student

# class is your describe block
# Arrange (set up data), Act (make request), Assert (check results/responses)
# Each test in a class block must make their own request, query their own user and make their own assertions