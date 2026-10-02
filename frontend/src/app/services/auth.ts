import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
    token: string;
    admin: {
        id: number;
        username: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:3000/api/auth';

    constructor(private http: HttpClient) {
    }

    login(username: string, password: string) {
        return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            {
                username,
                password
            }
        );
    }

    saveToken(token: string) {
        localStorage.setItem('motohub_token', token);
    }

    getToken() {
        return localStorage.getItem('motohub_token');
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    logout() {
        localStorage.removeItem('motohub_token');
    }
}