from rest_framework import serializers
from manga.models import Favorites
from .models import User
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile', 'date_joined']

class FavoritesSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Favorites
        fields = ['id', 'user', 'title', 'status', 'cover_art', 'added_at']
        read_only_fields = ['user', 'added_at']
    
    def get_user(self, obj):
        return obj.user.username
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Password do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid Username or Password")
        data['user'] = user
        return data