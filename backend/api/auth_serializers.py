from rest_framework import serializers
from django import forms


class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)


class TokenSerializer(serializers.Serializer):
    token = serializers.CharField()
