from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, AuthViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('api/', include(router.urls)),
]

