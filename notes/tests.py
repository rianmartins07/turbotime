import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Note
from .serializers import NoteSerializer, UserSerializer


@pytest.fixture
def api_client():
    """Create an API client for testing"""
    return APIClient()


@pytest.fixture
def user():
    """Create a test user"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )


@pytest.fixture
def another_user():
    """Create another test user for isolation testing"""
    return User.objects.create_user(
        username='anotheruser',
        email='another@example.com',
        password='testpass123'
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """Create an authenticated API client"""
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def note(user):
    """Create a test note"""
    return Note.objects.create(
        user=user,
        title='Test Note',
        content='This is a test note content',
        category='Random Thoughts'
    )


@pytest.fixture
def multiple_notes(user):
    """Create multiple test notes"""
    notes = []
    categories = ['Random Thoughts', 'School', 'Personal']
    for i, category in enumerate(categories):
        notes.append(Note.objects.create(
            user=user,
            title=f'Test Note {i+1}',
            content=f'Content for note {i+1}',
            category=category
        ))
    return notes


# ============================================================================
# MODEL TESTS
# ============================================================================

@pytest.mark.django_db
class TestNoteModel:
    """Test cases for Note model"""

    def test_create_note(self, user):
        """Test creating a note"""
        note = Note.objects.create(
            user=user,
            title='My Note',
            content='Note content',
            category='Random Thoughts'
        )
        assert note.title == 'My Note'
        assert note.content == 'Note content'
        assert note.category == 'Random Thoughts'
        assert note.user == user
        assert note.id is not None

    def test_note_str_representation(self, note):
        """Test note string representation"""
        assert str(note) == note.title

    def test_note_default_category(self, user):
        """Test note default category"""
        note = Note.objects.create(
            user=user,
            title='Note without category',
            content='Content'
        )
        assert note.category == 'Random Thoughts'

    def test_note_ordering(self, user):
        """Test notes are ordered by updated_at descending"""
        note1 = Note.objects.create(
            user=user,
            title='First Note',
            content='Content 1'
        )
        note2 = Note.objects.create(
            user=user,
            title='Second Note',
            content='Content 2'
        )
        notes = list(Note.objects.filter(user=user))
        assert notes[0] == note2
        assert notes[1] == note1


# ============================================================================
# SERIALIZER TESTS
# ============================================================================

@pytest.mark.django_db
class TestNoteSerializer:
    """Test cases for NoteSerializer"""

    def test_serialize_note(self, note):
        """Test serializing a note"""
        serializer = NoteSerializer(note)
        data = serializer.data
        assert data['id'] == note.id
        assert data['title'] == note.title
        assert data['content'] == note.content
        assert data['category'] == note.category
        assert 'created_at' in data
        assert 'updated_at' in data

    def test_deserialize_note(self, user):
        """Test deserializing note data"""
        data = {
            'title': 'New Note',
            'content': 'New content',
            'category': 'School'
        }
        serializer = NoteSerializer(data=data)
        assert serializer.is_valid()
        note = serializer.save(user=user)
        assert note.title == 'New Note'
        assert note.content == 'New content'
        assert note.category == 'School'
        assert note.user == user


@pytest.mark.django_db
class TestUserSerializer:
    """Test cases for UserSerializer"""

    def test_valid_user_serializer(self):
        """Test valid user serializer data"""
        data = {
            'email': 'newuser@example.com',
            'password': 'password123'
        }
        serializer = UserSerializer(data=data)
        assert serializer.is_valid()

    def test_invalid_email(self):
        """Test serializer with invalid email"""
        data = {
            'email': 'invalid-email',
            'password': 'password123'
        }
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_short_password(self):
        """Test serializer with password shorter than 8 characters"""
        data = {
            'email': 'user@example.com',
            'password': 'short'
        }
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert 'password' in serializer.errors

    def test_missing_fields(self):
        """Test serializer with missing required fields"""
        serializer = UserSerializer(data={})
        assert not serializer.is_valid()
        assert 'email' in serializer.errors
        assert 'password' in serializer.errors


# ============================================================================
# AUTH VIEWSET TESTS
# ============================================================================

@pytest.mark.django_db
class TestAuthViewSet:
    """Test cases for AuthViewSet"""

    def test_register_user_success(self, api_client):
        """Test successful user registration"""
        url = reverse('auth-register')
        data = {
            'email': 'newuser@example.com',
            'password': 'password123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert 'user' in response.data
        assert 'tokens' in response.data
        assert response.data['user']['email'] == 'newuser@example.com'
        assert 'access' in response.data['tokens']
        assert 'refresh' in response.data['tokens']
        assert User.objects.filter(email='newuser@example.com').exists()

    def test_register_user_duplicate_email(self, api_client, user):
        """Test registration with duplicate email"""
        url = reverse('auth-register')
        data = {
            'email': user.email,
            'password': 'password123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_user_invalid_data(self, api_client):
        """Test registration with invalid data"""
        url = reverse('auth-register')
        data = {
            'email': 'invalid-email',
            'password': 'short'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_success(self, api_client, user):
        """Test successful login"""
        url = reverse('auth-login')
        data = {
            'email': user.email,
            'password': 'testpass123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'user' in response.data
        assert 'tokens' in response.data
        assert response.data['user']['email'] == user.email
        assert 'access' in response.data['tokens']
        assert 'refresh' in response.data['tokens']

    def test_login_invalid_email(self, api_client):
        """Test login with non-existent email"""
        url = reverse('auth-login')
        data = {
            'email': 'nonexistent@example.com',
            'password': 'password123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in response.data

    def test_login_wrong_password(self, api_client, user):
        """Test login with wrong password"""
        url = reverse('auth-login')
        data = {
            'email': user.email,
            'password': 'wrongpassword'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in response.data

    def test_login_missing_fields(self, api_client):
        """Test login with missing email or password"""
        url = reverse('auth-login')
        response = api_client.post(url, {}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data


# ============================================================================
# NOTE VIEWSET TESTS
# ============================================================================

@pytest.mark.django_db
class TestNoteViewSet:
    """Test cases for NoteViewSet"""

    def test_list_notes_authenticated(self, authenticated_client, multiple_notes):
        """Test listing notes for authenticated user"""
        url = reverse('note-list')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == len(multiple_notes)

    def test_list_notes_unauthenticated(self, api_client):
        """Test listing notes without authentication"""
        url = reverse('note-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_notes_user_isolation(self, authenticated_client, user, another_user):
        """Test that users only see their own notes"""
        # Create note for user
        Note.objects.create(
            user=user,
            title='User Note',
            content='Content'
        )
        # Create note for another user
        Note.objects.create(
            user=another_user,
            title='Another User Note',
            content='Content'
        )
        url = reverse('note-list')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == 'User Note'

    def test_create_note(self, authenticated_client):
        """Test creating a new note"""
        url = reverse('note-list')
        data = {
            'title': 'New Note',
            'content': 'New content',
            'category': 'School'
        }
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Note'
        assert response.data['content'] == 'New content'
        assert response.data['category'] == 'School'
        assert Note.objects.filter(title='New Note').exists()

    def test_create_note_unauthenticated(self, api_client):
        """Test creating note without authentication"""
        url = reverse('note-list')
        data = {
            'title': 'New Note',
            'content': 'New content'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_retrieve_note(self, authenticated_client, note):
        """Test retrieving a specific note"""
        url = reverse('note-detail', kwargs={'pk': note.id})
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == note.id
        assert response.data['title'] == note.title

    def test_retrieve_note_other_user(self, authenticated_client, another_user):
        """Test retrieving note belonging to another user"""
        other_note = Note.objects.create(
            user=another_user,
            title='Other Note',
            content='Content'
        )
        url = reverse('note-detail', kwargs={'pk': other_note.id})
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_note(self, authenticated_client, note):
        """Test updating a note"""
        url = reverse('note-detail', kwargs={'pk': note.id})
        data = {
            'title': 'Updated Title',
            'content': 'Updated content',
            'category': 'Personal'
        }
        response = authenticated_client.put(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Title'
        assert response.data['content'] == 'Updated content'
        assert response.data['category'] == 'Personal'
        note.refresh_from_db()
        assert note.title == 'Updated Title'

    def test_partial_update_note(self, authenticated_client, note):
        """Test partially updating a note"""
        url = reverse('note-detail', kwargs={'pk': note.id})
        data = {'title': 'Partially Updated Title'}
        response = authenticated_client.patch(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Partially Updated Title'
        note.refresh_from_db()
        assert note.title == 'Partially Updated Title'
        # Content should remain unchanged
        assert note.content == 'This is a test note content'

    def test_delete_note(self, authenticated_client, note):
        """Test deleting a note"""
        url = reverse('note-detail', kwargs={'pk': note.id})
        response = authenticated_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Note.objects.filter(id=note.id).exists()

    def test_delete_note_other_user(self, authenticated_client, another_user):
        """Test deleting note belonging to another user"""
        other_note = Note.objects.create(
            user=another_user,
            title='Other Note',
            content='Content'
        )
        url = reverse('note-detail', kwargs={'pk': other_note.id})
        response = authenticated_client.delete(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Note.objects.filter(id=other_note.id).exists()

    def test_filter_notes_by_category(self, authenticated_client, multiple_notes):
        """Test filtering notes by category"""
        url = reverse('note-list')
        response = authenticated_client.get(url, {'category': 'School'})
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['category'] == 'School'

    def test_get_categories(self, authenticated_client, multiple_notes):
        """Test getting categories with counts"""
        url = reverse('note-categories')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
        categories = {cat['name']: cat['count'] for cat in response.data}
        assert categories['Random Thoughts'] == 1
        assert categories['School'] == 1
        assert categories['Personal'] == 1
        # Check that colors are included
        assert all('color' in cat for cat in response.data)

    def test_get_categories_empty(self, authenticated_client):
        """Test getting categories when user has no notes"""
        url = reverse('note-categories')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
        categories = {cat['name']: cat['count'] for cat in response.data}
        assert categories['Random Thoughts'] == 0
        assert categories['School'] == 0
        assert categories['Personal'] == 0

    def test_get_categories_unauthenticated(self, api_client):
        """Test getting categories without authentication"""
        url = reverse('note-categories')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
