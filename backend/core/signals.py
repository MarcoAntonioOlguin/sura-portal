from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Profile


def _create_default_profile(user: User) -> None:
    """Create a default profile for a new user if none exists."""
    if not hasattr(user, "profile"):
        Profile.objects.create(user=user, role="colocador")


@receiver(post_save, sender=User)
def create_profile(sender, instance: User, created: bool, **kwargs) -> None:
    if created:
        _create_default_profile(instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance: User, **kwargs) -> None:
    if hasattr(instance, "profile"):
        instance.profile.save()
