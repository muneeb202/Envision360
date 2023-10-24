from .serializers import *
from .models import *
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.db.utils import IntegrityError


class UserCreate(APIView):
    def post(self, request):
        data = request.data

        try:
            User.objects.create_user(
                username=data.get("username"),
                email=data.get("email"),
                password=data.get("password"),
            )
            return Response("user created", status=status.HTTP_200_OK)
        except IntegrityError as ie:
            return Response(
                {"error": "Username Already Exists"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")
        user = User.objects.get(username=username)
        if user and user.check_password(password):
            return Response("login successful", status=status.HTTP_200_OK)
        else:
            return Response("login failed", status=status.HTTP_400_BAD_REQUEST)
