from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.utils import timezone
import os

class Image(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    created_date = models.DateTimeField(default=timezone.now)
    posted = models.BooleanField(default=False)
    favourite = models.BooleanField(default=False)
    likes = models.PositiveIntegerField(default=0)
    liked_by = models.ManyToManyField(User, related_name='liked_images', blank=True)

    def __str__(self):
        return self.title

@receiver(pre_delete, sender=Image)
def delete_image_file(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    description = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.image.title}"
 