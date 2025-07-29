const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async requestWithFile(endpoint, formData, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'POST',
            body: formData,
            headers: {},
            ...options,
        };
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async logout() {
        return this.request('/auth/logout', { method: 'POST' });
    }

    async getAllBooks(queryParams = {}) {
        const searchParams = new URLSearchParams(queryParams);
        const queryString = searchParams.toString();
        const endpoint = queryString ? `/books?${queryString}` : '/books';
        return this.request(endpoint);
    }

    async getBookById(id) {
        return this.request(`/books/${id}`);
    }

    async createBook(bookData) {
        const formData = new FormData();
        Object.keys(bookData).forEach(key => {
            if (bookData[key] !== null && bookData[key] !== undefined) {
                formData.append(key, bookData[key]);
            }
        });
        return this.requestWithFile('/books', formData);
    }

    async updateBook(id, bookData) {
        const formData = new FormData();
        Object.keys(bookData).forEach(key => {
            if (bookData[key] !== null && bookData[key] !== undefined) {
                formData.append(key, bookData[key]);
            }
        });
        return this.requestWithFile(`/books/${id}`, formData, { method: 'PUT' });
    }

    async patchBook(id, bookData) {
        return this.request(`/books/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(bookData),
        });
    }

    async deleteBook(id) {
        return this.request(`/books/${id}`, { method: 'DELETE' });
    }

    async getGenres() {
        return this.request('/books/genres');
    }

    async getFavoritesByUserId(userId) {
        return this.request(`/books/favorites/${userId}`);
    }

    async addFavorite(userId, bookId) {
        return this.request('/books/favorites', {
            method: 'POST',
            body: JSON.stringify({ userId, bookId }),
        });
    }

    async removeFavorite(userId, bookId) {
        return this.request('/books/favorites', {
            method: 'DELETE',
            body: JSON.stringify({ userId, bookId }),
        });
    }

    async countFavorites() {
        return this.request('/books/favorites/count');
    }

    async getAllUsers() {
        return this.request('/users');
    }

    async getUserById(id) {
        return this.request(`/users/${id}`);
    }

    async createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async updateUser(id, userData) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(id) {
        return this.request(`/users/${id}`, { method: 'DELETE' });
    }

    async countUsers() {
        return this.request('/users/count');
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    clearToken() {
        localStorage.removeItem('token');
    }

    getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    setCurrentUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    }

    clearCurrentUser() {
        localStorage.removeItem('user');
    }
}

const Api = new ApiService();

export { Api };
export { ApiService };
