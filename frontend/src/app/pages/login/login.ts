import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-login',
    imports: [RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {

    errorMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    login(
        username: string,
        password: string
    ) {

        this.errorMessage = '';

        if (!username.trim() || !password) {
            this.errorMessage =
                'A felhasználónév és a jelszó megadása kötelező.';
            return;
        }

        this.isLoading = true;

        this.authService
            .login(username.trim(), password)
            .subscribe({
                next: response => {

                    this.authService.saveToken(
                        response.token
                    );

                    this.isLoading = false;

                    this.router.navigate(['/admin']);
                },

                error: (error: HttpErrorResponse) => {

                    this.isLoading = false;

                    this.errorMessage =
                        error.error?.message ||
                        'Hiba történt a bejelentkezés során.';
                }
            });
    }
}