const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const register = async (username, email, password, securityQuestion, securityAnswer) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, securityQuestion, securityAnswer }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  // Store token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Store token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getSecurityQuestion = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/security-question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to get security question');
  }

  return data.securityQuestion;
};

export const resetPassword = async (email, securityAnswer, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, securityAnswer, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Password reset failed');
  }

  return data;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};
