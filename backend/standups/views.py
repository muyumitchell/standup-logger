from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import StandupPost
from .serializers import StandupPostSerializer

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