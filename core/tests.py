from django.contrib.auth.models import User
from django.test import TestCase

from .models import Profile


class ProfileSignalTests(TestCase):
    def test_profile_created_on_user_creation(self):
        user = User.objects.create_user(username="alice", password="pwd")
        self.assertTrue(Profile.objects.filter(user=user).exists())
