from rest_framework import serializers
from .models import StandupPost

class StandupPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = StandupPost
        fields = '__all__'