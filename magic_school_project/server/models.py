from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

# Custom user manager
class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')  # Set role to admin for superusers
        return super().create_superuser(username, email, password, **extra_fields)

# Custom User model with roles
class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        TEACHER = 'teacher', 'Teacher'
        ADMIN = 'admin', 'Admin'
    
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT
    )
    
    class Meta:
        ordering = ['role', 'username']
    
    objects = CustomUserManager()  # Use custom manager

# Returns the ID of a substitute teacher when a teacher is deleted.
def get_substitute_teacher():
    return User.objects.filter(role=User.Role.TEACHER).first().id

# Course model with assigned teacher and enrolled students
class Course(models.Model):
    course_title = models.CharField(max_length=100)
    course_description = models.TextField()
    teacher = models.ForeignKey(User, on_delete=models.SET(get_substitute_teacher), limit_choices_to={'role': User.Role.TEACHER})
    enrolled_students = models.ManyToManyField(User, related_name='courses', limit_choices_to={'role': User.Role.STUDENT})
    
    class Meta:
        ordering = ['course_title']
    
    def __str__(self):
        return self.course_title
