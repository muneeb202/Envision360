from .serializers import *
from .models import *
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.db.utils import IntegrityError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

def get_token_user(token):
    user_id = None

    if not token:
        return {'error': 'Token not provided', 'status':status.HTTP_400_BAD_REQUEST}

    try:
        decoded_token = RefreshToken(token)
        user_id = decoded_token['user_id']

    except Exception:
        try:
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']

        except Exception:
            return {'error': 'Invalid token', 'status':status.HTTP_401_UNAUTHORIZED}

    user = User.objects.get(id=user_id)
    return {'user': user, 'status':status.HTTP_200_OK}

class UserCreate(APIView):
    def post(self, request):
        data = request.data

        try:
            user = User.objects.create_user(
                username=data.get("username"),
                email=data.get("email"),
                password=data.get("password"),
            )
            refresh = RefreshToken.for_user(user)
            response_data = {
                'token': str(refresh) if request.data.get('refresh') else str(refresh.access_token),
                'message': 'Signup successful',
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except IntegrityError:
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

class GetUser(APIView):
    def post(self, request):
        user_response = get_token_user(request.data.get('token'))
        if 'error' in user_response:
            return Response(user_response['error'], user_response['status'])
        return Response({'name': user_response['user'].name, 'email': user_response['user'].email}, user_response['status'])
