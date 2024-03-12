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
from django.core.files.uploadedfile import InMemoryUploadedFile
import cv2
import uuid
import numpy as np
from django.core.files.storage import default_storage
from django.http import HttpResponse
from django.conf import settings
from stitching import Stitcher
from serpapi import GoogleSearch
from pygoogle_image import image as pi
import urllib.request
from geopy.geocoders import Nominatim
import glob


class WebScrape(APIView):
    parser_classes = [MultiPartParser]

    def location_to_coordinates(self, location_name):
        geolocator = Nominatim(user_agent="location_converter")
        try:
            location = geolocator.geocode(location_name)
            if location:
                # Extract coordinates
                latitude = location.latitude
                longitude = location.longitude
                return f"@{latitude},{longitude},17z"
            else:
                print(f"{location_name} coordinates not found.")
                return "@31.461157,74.4086162,17z"
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def coordinates_to_location(self, latitude, longitude):
        geolocator = Nominatim(user_agent="location_converter")
        try:
            location = geolocator.reverse((latitude, longitude))
            if location:
                return location.address
            else:
                print(f"{latitude}, {longitude} location not found.")
                return None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def post(self, request):
        print(request.data)
        query = ""
        coord = ""
        if request.data["generateType"] == "1":
            query = request.data["query"]
            coord = self.location_to_coordinates(query)
        else:
            lat = request.data["latitude"]
            longi = request.data["longitude"]
            coord = f"@{lat},{longi},17z"
            query = self.coordinates_to_location(lat, longi)
        print(query, coord)

        if query and coord:
            params = {
                "api_key": "30d34cd305aa9788998023223750f58fbcef25ab36d5e00565d54f6be8cbbc7e",
                "engine": "google_maps",  # SerpApi search engine
                "q": query,  # query
                "ll": coord,  # GPS coordinates
                "type": "search",
                "hl": "en",  # language
                "start": 0,
            }

            try:
                title = "Arcadian Cafe"
                #     search = GoogleSearch(
                #         params
                #     )  # where data extraction happens on the backend
                #     results = search.get_dict()
                #     data_id = None
                #     title = None

                #     if "local_results" in results:
                #         data_id = results["local_results"]["data_id"]
                #         title = results["local_results"]["title"]
                #     else:
                #         data_id = results["place_results"]["data_id"]
                #         title = results["place_results"]["title"]
                #     print(title,data_id)
                params = {
                    "api_key": "30d34cd305aa9788998023223750f58fbcef25ab36d5e00565d54f6be8cbbc7e",
                    "engine": "google_maps_photos",
                    "hl": "en",
                    "data_id": "0x3919099de7eeacd9:0xed8bafee3c8f975a",  # place result
                }

                # search = GoogleSearch(params)
                # new_page_results = search.get_dict()
                # photos = []
                # images = []
                # photos.extend(new_page_results["photos"])

                output_directory = "downloaded_images"

                directory_path = os.path.join(settings.MEDIA_ROOT, output_directory)

                # if not os.path.exists(directory_path):
                #     os.makedirs(directory_path)

                # for i, photo in enumerate(photos):
                #     img_url = photo["image"]
                #     img_filename = f"{title}_image_{i + 1}.jpg"
                #     img_filepath = os.path.join(directory_path, img_filename)
                #     # Download the image
                #     urllib.request.urlretrieve(img_url, img_filepath)
                #     print(f"Downloaded: {img_filename}")
                #     images.append(img_filepath)

                # print(images)

                # start = int(request.data["thresh"])

                # if not images:
                #     return Response(
                #         {"error": "Images not provided"},
                #         status=status.HTTP_400_BAD_REQUEST,
                #     )

                try:

                    # for i in range(start, 0, -1):
                    #     print(i)
                    #     try:
                    #         stitcher = Stitcher(
                    #             confidence_threshold=i / 10, blend_strength=20
                    #         )  # Create an affine stitcher object
                    #         stitched_img = stitcher.stitch(images)  # Stitch images

                    #         stitched_image_path = os.path.join(
                    #             settings.MEDIA_ROOT, "stitched_image.jpg"
                    #         )
                    #         cv2.imwrite(stitched_image_path, stitched_img)
                    #         stitched_image_url = os.path.join(
                    #             settings.MEDIA_URL, "stitched_image.jpg"
                    #         ).replace("\\", "/")
                    #         return JsonResponse(
                    #             {
                    #                 "success": True,
                    #                 "stitched_image_url": stitched_image_url,
                    #                 "threshold": i,
                    #             }
                    #         )
                    #     except Exception as e:
                    #         print(str(e))
                    print("Image stitching failed")
                    downloaded_images = glob.glob(os.path.join(directory_path, "*.jpg"))
                    print(downloaded_images)
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "Image stitching failed",
                            "downloaded_images": downloaded_images,
                        }
                    )
                    # return Response(
                    #     {"success": False, "message": "Image stitching failed"},
                    #     status=status.HTTP_404_NOT_FOUND,
                    # )
                except Exception as e:
                    print(e, "Image Memory handling failed")
                    return Response(
                        {
                            "success": False,
                            "error": str(e),
                            "message": "Image Memory handling failed",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except Exception as e:
                print(e, "unable to download google maps images")
                return Response(
                    {
                        "success": False,
                        "error": str(e),
                        "message": "unable to download google maps images",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
                # print("Unable to map images, downloading google images instead")
                # pi.download(keywords=f"{query} street view", limit=10)
        else:
            print("Location not found")
            return Response(
                {"success": False, "message": "Location not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

class StitchImage(APIView):
    parser_classes = [MultiPartParser]

    # @jit(target_backend='cuda')	
    def post(self, request):
        print(request.data)
        start = int(request.data["thresh"])
        uploaded_images = request.data.getlist("images[]")

        if not uploaded_images:
            return Response(
                {"error": "Images not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            images = []
            i = 0
            for uploaded_image in uploaded_images:
                if isinstance(uploaded_image, InMemoryUploadedFile):
                    # If the file is in memory, handle it accordingly
                    image = cv2.imdecode(
                        np.fromstring(uploaded_image.read(), np.uint8),
                        cv2.IMREAD_UNCHANGED,
                    )
                    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                    i += 1
                else:
                    # If the file is on disk, get its temporary file path
                    image = uploaded_image.temporary_file_path()


                images.append(image)

            for i in range(start, 0, -1):
                print(i) 
                try:
                    stitcher = Stitcher(confidence_threshold=i/10, crop=False)  # Create an affine stitcher object
                    stitched_img = stitcher.stitch(images)  # Stitch images
                    # image_stitcher = cv2.Stitcher_create()
                    # print("stitching")
                    # error, stitched_img = image_stitcher.stitch(images)
 
                    stitched_image_path = os.path.join(
                        settings.MEDIA_ROOT, "stitched_image.jpg" 
                    )
                    cv2.imwrite(stitched_image_path, stitched_img)
                    stitched_image_url = os.path.join(
                        settings.MEDIA_URL, "stitched_image.jpg"
                    ).replace("\\", "/")
                    return JsonResponse(
                        {
                            "success": True,
                            "stitched_image_url": stitched_image_url,
                            "threshold": i,
                        }
                    )
                except Exception as e:
                    print(str(e))
            return Response(
                {"success": False, "message": "Image stitching failed"},
                status=status.HTTP_404_NOT_FOUND,
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
                "user": (
                    str(refresh)
                    if request.data.get("refresh")
                    else str(refresh.access_token)
                ),
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
                "user": (
                    str(refresh)
                    if request.data.get("refresh")
                    else str(refresh.access_token)
                ),
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
        uploaded_image = request.data.get("image")
        title = request.data.get("title")
        print(request.data)

        if not uploaded_image:
            return Response(
                {"error": "Image not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Save the image with a custom title in the assets/images folder
            img = cv2.imread("assets/stitched_image.jpg")
            path = f"images/{title}_{str(uuid.uuid4())[:8]}.jpg"
            cv2.imwrite("assets/" + path, img)

            image_instance = Image(user=user, image=path, title=title)
            image_instance.save()

            return Response(
                {"message": "Successfully saved image"}, status=status.HTTP_201_CREATED
            )
        except Exception as e:
            print(str(e))
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
        print(request.data)

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
