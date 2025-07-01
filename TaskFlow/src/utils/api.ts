const getAuthToken = () => localStorage.getItem('token');

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Handle unauthorized access, e.g., redirect to login
      console.error('Authentication error. Please log in again.');
      // Consider calling a logout function here
    }
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleApiResponse(response);
  },

  post: async (endpoint: string, body: any) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },

  put: async (endpoint: string, body: any) => {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },

  delete: async (endpoint: string) => {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    // For DELETE, we might not always get a JSON body back on success
    if (!response.ok) {
        return handleApiResponse(response);
    }
    return { success: true };
  },

  login: async (endpoint: string, body: any) => {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  }
}; 