from rest_framework import serializers
from .models import Image, Comment


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["created_date"] = instance.created_date.strftime(
            "%d %B %Y"
        )  # Format the date as '20 September 2023'
        return representation


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
