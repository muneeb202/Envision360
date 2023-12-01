from rest_framework import serializers
from .models import Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'title', 'description', 'image', 'created_date', 'posted', 'favourite', 'likes']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['created_date'] = instance.created_date.strftime('%d %B %Y')  # Format the date as '20 September 2023'
        return representation
