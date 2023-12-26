from .serializers import *
from .models import *
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.db.utils import IntegrityError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.http import JsonResponse
import cv2
from django.http import HttpResponse
from django.conf import settings


class StitchImage(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        uploaded_images = request.data.getlist("images[]")

        if not uploaded_images:
            return Response(
                {"error": "Images not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            images = []

            for uploaded_file in uploaded_images:
                img = cv2.imread(uploaded_file.temporary_file_path())
                images.append(img)

            image_stitcher = cv2.Stitcher_create()
            print("stitching")
            error, stitched_img = image_stitcher.stitch(images)

            if not error:
                stitched_image_path = os.path.join(
                    settings.MEDIA_ROOT, "stitched_image.jpg"
                )
                cv2.imwrite(stitched_image_path, stitched_img)
                stitched_image_url = os.path.join(
                    settings.MEDIA_URL, "stitched_image.jpg"
                ).replace("\\", "/")
                return JsonResponse(
                    {"success": True, "stitched_image_url": stitched_image_url}
                )
            else:
                return JsonResponse(
                    {"success": False, "message": "Image stitching failed"}
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def get_token_user(token):
    user_id = None

    if not token:
        return {"error": "Token not provided", "status": status.HTTP_400_BAD_REQUEST}

    try:
        decoded_token = RefreshToken(token)
        user_id = decoded_token["user_id"]

    except Exception:
        try:
            decoded_token = AccessToken(token)
            user_id = decoded_token["user_id"]

        except Exception:
            return {"error": "Invalid token", "status": status.HTTP_401_UNAUTHORIZED}

    user = User.objects.get(id=user_id)
    return {"user": user, "status": status.HTTP_200_OK}


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
                "user": str(refresh)
                if request.data.get("refresh")
                else str(refresh.access_token),
                "message": "Signup successful",
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
            refresh = RefreshToken.for_user(user)
            response_data = {
                "user": str(refresh)
                if request.data.get("refresh")
                else str(refresh.access_token),
                "message": "Login successful",
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response("login failed", status=status.HTTP_400_BAD_REQUEST)


class GetUser(APIView):
    def post(self, request):
        user_response = get_token_user(request.data.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])
        return Response(
            {
                "id": user_response["user"].id,
                "name": user_response["user"].username,
                "email": user_response["user"].email,
                "date_joined": user_response["user"].date_joined,
            },
            user_response["status"],
        )


class UserImage(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        user_response = get_token_user(request.data.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])

        user = user_response["user"]
        image = request.data.get("image")
        title = request.data.get("title")

        if not image:
            return Response(
                {"error": "Image not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            image_instance = Image(user=user, image=image, title=title)
            image_instance.save()

            return Response(
                {"message": "Successfully saved image"}, status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user_response = get_token_user(request.query_params.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])

        user = user_response["user"]
        images = Image.objects.filter(user=user)

        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateTitle(APIView):
    def post(self, request):
        user_response = get_token_user(request.data.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])

        user = user_response["user"]
        image_id = request.data.get("image_id")
        new_title = request.data.get("new_title")

        try:
            image = Image.objects.get(id=image_id)
            image.title = new_title
            image.save()
            serializer = ImageSerializer(image)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Image.DoesNotExist:
            return Response(
                {"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateLikes(APIView):
    def post(self, request):
        user_response = get_token_user(request.data.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])

        user = user_response["user"]
        image_id = request.data.get("image_id")
        print("9999999")
        try:
            image = Image.objects.get(id=image_id, posted=True)
            print(image.liked_by.all())
            if user in image.liked_by.all():
                # User has already liked, unlike
                image.liked_by.remove(user)
                image.likes -= 1
            else:
                # User hasn't liked, like
                image.liked_by.add(user)
                image.likes += 1

            image.save()
            print(image.liked_by.all())
            serializer = ImageSerializer(image, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Image.DoesNotExist:
            return Response(
                {"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateFavourite(APIView):
    def post(self, request):
        user_response = get_token_user(request.data.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])

        user = user_response["user"]
        image_id = request.data.get("image_id")

        try:
            image = Image.objects.get(user=user, id=image_id)
            image.favourite = not image.favourite
            image.save()
            serializer = ImageSerializer(image)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Image.DoesNotExist:
            return Response(
                {"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdatePostedStatus(APIView):
    def post(self, request):
        user_response = get_token_user(request.data.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])

        user = user_response["user"]
        image_id = request.data.get("image_id")
        desc = request.data.get("description", "")

        try:
            image = Image.objects.get(user=user, id=image_id)
            image.posted = not image.posted
            image.description = desc
            image.save()
            serializer = ImageSerializer(image)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Image.DoesNotExist:
            return Response(
                {"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteImage(APIView):
    def post(self, request):
        user_response = get_token_user(request.data.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])

        user = user_response["user"]
        image_id = request.data.get("image_id")

        try:
            image = Image.objects.get(user=user, id=image_id)
            image.delete()
            return Response(
                {"message": "Image deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Image.DoesNotExist:
            return Response(
                {"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BlogPosts(APIView):
    def get(self, request):
        user_response = get_token_user(request.query_params.get("token", None))
        try:
            blog_posts = Image.objects.filter(posted=True)
            if "error" not in user_response:
                serializer = ImageSerializer(
                    blog_posts, many=True, context={"user": user_response["user"]}
                )
            else:
                serializer = ImageSerializer(blog_posts, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommentOnPost(APIView):
    def post(self, request):
        try:
            user_response = get_token_user(request.data.get("token"))
            if "error" in user_response:
                return Response(user_response["error"], user_response["status"])

            user = user_response["user"]
            image_id = request.data.get("image_id")
            comment_description = request.data.get("comment_description")

            try:
                image = Image.objects.get(id=image_id, posted=True)
            except Image.DoesNotExist:
                return Response(
                    {"error": "Image not found or not posted"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            comment = Comment(user=user, image=image, description=comment_description)
            comment.save()

            return Response(
                {"comment": CommentSerializer(comment).data},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        try:
            post_id = request.query_params.get("post_id")
            if not post_id:
                return Response(
                    {"error": "Post ID is required in query parameters"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                image = Image.objects.get(id=post_id, posted=True)
            except Image.DoesNotExist:
                return Response(
                    {"error": "Image not found or not posted"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            comments = Comment.objects.filter(image=image)
            serializer = CommentSerializer(comments, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DeleteComment(APIView):
    def post(self, request):
        user_response = get_token_user(request.data.get("token"))
        if "error" in user_response:
            return Response(user_response["error"], user_response["status"])
        user = user_response["user"]

        comment_id = request.data.get("comment")

        try:
            comment = Comment.objects.get(id=comment_id, user=user)
            comment.delete()
            return Response(
                {"message": "Comment deleted successfully"}, status=status.HTTP_200_OK
            )

        except Comment.DoesNotExist:
            return Response(
                {"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND
            )
