from django.urls import path
from api import views

urlpatterns = [
    path("create_user/", views.UserCreate.as_view(), name="create_user"),
    path("login/", views.UserLogin.as_view(), name="login"),
]
