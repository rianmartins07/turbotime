const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}


function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token)
  }
}


function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
  }
}


function getAuthHeaders(includeContentType = true, includeAuth = true) {
  const token = getToken()
  const headers = {}
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json'
  }
  
  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const hasBody = options.body !== undefined
  const includeAuth = options.includeAuth !== false
  const method = options.method || 'GET'
  
  const config = {
    method,
    ...options,
    headers: {
      ...getAuthHeaders(hasBody, includeAuth),
      ...options.headers,
    },
  }
  
  delete config.includeAuth

  try {
    const response = await fetch(url, config)
    
    if (response.status === 204 || response.status === 404) {
      return null
    }
    
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'An error occurred')
    }

    return data
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid response from server')
    }
    throw error
  }
}

export const authAPI = {
  register: async (email, password) => {
    const data = await apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      includeAuth: false,
    })
    
    if (data.tokens?.access) {
      setToken(data.tokens.access)
    }
    
    return data
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      includeAuth: false,
    })
    
    if (data.tokens?.access) {
      setToken(data.tokens.access)
    }
    
    return data
  },

  logout: () => {
    removeToken()
  },
}
export const notesAPI = {
  getAll: async (category = null) => {
    const endpoint = category 
      ? `/notes/?category=${encodeURIComponent(category)}`
      : '/notes/'
    return apiRequest(endpoint)
  },

  getById: async (id) => {
    return apiRequest(`/notes/${id}/`)
  },

  create: async (note) => {
    return apiRequest('/notes/', {
      method: 'POST',
      body: JSON.stringify(note),
    })
  },

  update: async (id, note) => {
    return apiRequest(`/notes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(note),
    })
  },

  patch: async (id, note) => {
    return apiRequest(`/notes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(note),
    })
  },

  delete: async (id) => {
    const response = await apiRequest(`/notes/${id}/`, {
      method: 'DELETE',
    })
    return response
  },

  getCategories: async () => {
    return apiRequest('/notes/categories/')
  },
}

export { getToken, setToken, removeToken }

