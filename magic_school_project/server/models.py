from django.db import models
from django.contrib.auth.models import AbstractUser

def get_substitute_teacher():
    # Returns the ID of a substitute teacher when a teacher is deleted.
    return User.objects.filter(role=User.Role.TEACHER).first().id

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

class Course(models.Model):
    course_title = models.CharField(max_length=100)
    course_description = models.TextField()
    teacher = models.ForeignKey(User, on_delete=models.SET(get_substitute_teacher), limit_choices_to={'role': User.Role.TEACHER})
    
    class Meta:
        ordering = ['course_title']
    
    def __str__(self):
        return self.course_title
