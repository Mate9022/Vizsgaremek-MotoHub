import { Component } from '@angular/core';
import {
    Router,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-admin-layout',
    imports: [
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.css'
})
export class AdminLayout {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    logout() {
        this.authService.logout();

        this.router.navigate(['/login']);
    }
}