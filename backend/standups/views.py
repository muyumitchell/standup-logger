from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from datetime import timedelta
from .models import StandupPost
from .serializers import StandupPostSerializer

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username})

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username})
    return Response({'error': 'Invalid username or password'}, status=400)

@api_view(['GET', 'POST'])
def standup_list(request):
    if request.method == 'GET':
        posts = StandupPost.objects.all().order_by('-timestamp')
        serializer = StandupPostSerializer(posts, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = StandupPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
def standup_detail(request, pk):
    try:
        post = StandupPost.objects.get(pk=pk)
    except StandupPost.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)
    serializer = StandupPostSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def standup_stats(request):
    today = timezone.now().date()
    stats = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        posts = StandupPost.objects.filter(timestamp__date=day)
        stats.append({
            'date': str(day),
            'post_count': posts.count(),
            'blocker_count': posts.filter(has_blocker=True).count(),
        })
    return Response(stats)