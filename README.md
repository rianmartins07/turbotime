# Notes Taking App

A simple notes-taking application built with Django (backend) and Next.js (frontend).

## Development Approach

The approach I used to achieve the best results for the final product effectively:

1. **Initial Review & Planning**
   - Reviewed all requirements, technologies, frameworks, the video, and Figma design
   - Prepared a clear understanding of what needed to be accomplished

2. **Frontend Setup**
   - Started with the frontend development
   - Used a common plugin to transform the Figma design into Next.js code

3. **Selective Screen Import**
   - Due to the plugin's free plan limitations, I selected the most complex screens to develop
   - Imported the essential components into the project

4. **AI Configuration & Rules**
   - Accessed the Cursor community and obtained two rule files:
     - Next.js principles and best practices
     - Django and Django REST Framework principles
   - Placed all rule files in the `.cursor/rules` directory of the project
   - Copied the project instructions and pasted them into the project rules for AI context

5. **Backend Development**
   - After completing the initial setup, used Cursor AI to develop the backend
   - Implemented views, URLs, serializers, and other necessary components
   - Consistently used the context file and automatically applied rules throughout development

6. **Testing & Refinement**
   - Implemented comprehensive test coverage for backend API endpoints (32+ test cases)
   - Ran the server and performed minimal design adjustments
   - Ensured the implementation closely followed the original Figma design

7. **Final Result**
   - Delivered the final product as you can see in the repository

## Key Design & Technical Decisions

### Architecture Decisions

1. **Separated Frontend and Backend**
   - Frontend: Next.js 14 with App Router for modern React patterns
   - Backend: Django REST Framework for robust API development
   - Clear separation allows independent scaling and deployment

2. **Authentication Strategy**
   - Implemented JWT (JSON Web Tokens) authentication using `djangorestframework-simplejwt`
   - Secure token-based authentication for API access
   - User isolation at the database level

3. **State Management**
   - Used React hooks (useState, useEffect) for local component state
   - API calls centralized in `/app/api/index.js` for maintainability
   - No global state management library needed for this scope

4. **Styling Approach**
   - Tailwind CSS for utility-first styling
   - Responsive design with mobile-first approach
   - Custom components built with reusable UI patterns

5. **Database Design**
   - SQLite for development (easy setup)
   - User-Note relationship with proper foreign keys
   - Category system with predefined options and colors
   - Notes ordered by `updated_at` for most recent first

6. **Testing Strategy**
   - Comprehensive backend testing with pytest and pytest-django
   - Test coverage includes:
     - Model validation and relationships
     - Serializer functionality
     - API endpoint authentication and authorization
     - User isolation and data security
   - 32+ test cases covering critical paths

### Technical Choices

- **Next.js App Router**: Modern routing and server components support
- **Django REST Framework**: Rapid API development with built-in serialization
- **JWT Authentication**: Stateless, scalable authentication
- **Tailwind CSS**: Fast development with utility classes
- **Pytest**: Python testing framework for comprehensive test coverage

## AI Tools Usage

### Cursor AI

**How I used it:**
- **Code Generation**: Used Cursor's AI assistant to generate boilerplate code for Django models, serializers, views, and React components
- **Context-Aware Development**: Configured custom rules in `.cursor/rules/` to ensure code follows Next.js and Django best practices
- **Problem Solving**: Leveraged AI to debug issues and optimize code structure
- **Documentation**: Used AI to generate inline comments and documentation

**Specific Use Cases:**
1. **Backend Development**: Generated Django REST Framework viewsets, serializers, and URL configurations
2. **Frontend Components**: Created reusable React components following the design system
3. **Test Writing**: Assisted in writing comprehensive test cases for API endpoints
4. **Code Refactoring**: Improved code quality and maintainability with AI suggestions

**Benefits:**
- Accelerated development while maintaining code quality
- Ensured consistency with framework best practices
- Reduced time spent on repetitive boilerplate code
- Focused more time on business logic and user experience




## Project Structure

```
note-app/
├── config/           # Django project
├── notes/            # Django app for notes
├── frontend/         # Next.js application
├── venv/             # Python virtual environment
└── manage.py         # Django management script
```

## Setup

### Backend (Django)

1. Activate the virtual environment:
```bash
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

5. Run the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/notes/`

### Frontend (Next.js)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/notes/` - List all notes
- `POST /api/notes/` - Create a new note
- `GET /api/notes/{id}/` - Get a specific note
- `PUT /api/notes/{id}/` - Update a note
- `PATCH /api/notes/{id}/` - Partially update a note
- `DELETE /api/notes/{id}/` - Delete a note

## Tech Stack

- **Backend**: Django 5.2.9, Django REST Framework, JWT Authentication
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Database**: SQLite (default, can be changed for production)
- **Testing**: pytest, pytest-django
- **Development Tools**: Cursor AI, ESLint, Prettier

## Testing

The project includes comprehensive test coverage for the backend API:

- **32+ test cases** covering models, serializers, viewsets, and authentication
- Run tests with: `pytest` or `python manage.py test`
- Test coverage includes:
  - User authentication and authorization
  - CRUD operations for notes
  - User data isolation
  - Input validation
  - Error handling

## Demo Video

A 5-minute walkthrough video demonstrating the app's functionality is available. The video covers:
https://www.loom.com/share/393cf8335b21426dbb585961c974330b

- User registration and authentication
- Creating, reading, updating, and deleting notes
- Category filtering and organization
- Responsive design across different screen sizes

