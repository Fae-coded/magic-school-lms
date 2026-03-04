from django.test import TestCase
from django.urls import reverse
from server.models import User, Course
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse('register')
        
        self.valid_payload = {
            'username': 'aidoneus',
            'email': 'aidoneus@strixhaven.com',
            'password': 'Odette!1'
        }
        
        self.invalid_payload = {
            'username': 'aidoneus',
            'password': 'Odette!69'
        }
        
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
        self.url = reverse('login')
        
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
        self.url = reverse('logout')
        
        self.user = User.objects.create_user(
            username= 'aurelia',
            email='aurelia@strixhaven.com',
            password='FireHorse'
        )
        
        self.refresh = RefreshToken.for_user(self.user)
        
        self.client.force_authenticate(user=self.user)
        
    def test_gets_refresh_token_and_blacklists_token(self):
        response = self.client.post(
            self.url,
            {"refresh": str(self.refresh)},
            format='json')
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)   
        
    def test_no_refresh_token_bad_request(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    
class UserAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse('user-list')
        
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
            email= 'nossk@strixhaven.com',
            password= 'NineInchClaws',
            role= User.Role.STUDENT
        )
        
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
    
    
class CourseAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse('course-list')
        
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
            email= 'nossk@strixhaven.com',
            password= 'NineInchClaws',
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
                   
    def create_course(self, payload):
        return self.client.post(self.url, payload, format='json')
        
    def test_registered_users_can_get_course_list(self):
        self.client.force_authenticate(user= self.admin)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_unauthenticated_users_can_not_get_course_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
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
  
# class is your describe block
# Arrange (set up data), Act (make request), Assert (check results/responses)
# Each test in a class block must make their own request, query their own user and make their own assertions