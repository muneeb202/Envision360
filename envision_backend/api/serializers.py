from rest_framework import serializers
from .models import Image, Comment


class ImageSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = [
            "id",
            "title",
            "description",
            "image",
            "created_date",
            "posted",
            "favourite",
            "likes",
            "user",
            "username",
            "liked_by_user",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["created_date"] = instance.created_date.strftime(
            "%d %B %Y"
        )  # Format the date as '20 September 2023'
        return representation

    def get_liked_by_user(self, instance):
        user = self.context.get("user")
        return instance.liked_by.filter(pk=user.pk).exists() if user else False


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Comment
        fields = [
            "id",
            "description",
            "image",
            "created_date",
            "user",
            "username",
        ]
