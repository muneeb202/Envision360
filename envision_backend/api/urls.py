from django.urls import path
from api import views
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path("create_user/", views.UserCreate.as_view(), name="create_user"),
    path("login/", views.UserLogin.as_view(), name="login"),
    path("get_user/", views.GetUser.as_view(), name="get user"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
