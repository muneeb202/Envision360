from django.urls import path
from api import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("create_user/", views.UserCreate.as_view(), name="create_user"),
    path("login/", views.UserLogin.as_view(), name="login"),
    path("get_user/", views.GetUser.as_view(), name="get_user"),
    path("user_image/", views.UserImage.as_view(), name="user_image"),
    path("update_likes/", views.UpdateLikes.as_view(), name="update_likes"),
    path("update_title/", views.UpdateTitle.as_view(), name="update_title"),
    path("update_favourite/", views.UpdateFavourite.as_view(), name="update_favourite"),
    path("update_posted_status/", views.UpdatePostedStatus.as_view(), name="update_posted_status"),
    path("delete_image/", views.DeleteImage.as_view(), name="delete_image"),
    path("comment/", views.CommentOnPost.as_view(), name="comment"),    
    path("delete_comment/", views.DeleteComment.as_view(), name="delete_comment"),
    path("blogposts/", views.BlogPosts.as_view(), name="blogposts"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
