import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.html',
    styleUrl: './settings.css'
})
export class Settings {
    errorMessage = '';
    successMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    changePassword(
        currentPassword: string,
        newPassword: string,
        confirmPassword: string,
        form: HTMLFormElement
    ) {
        this.errorMessage = '';
        this.successMessage = '';

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.errorMessage = 'Minden jelszómező kitöltése kötelező.';
            return;
        }

        if (newPassword.length < 12 || new TextEncoder().encode(newPassword).length > 72) {
            this.errorMessage = 'Az új jelszó legalább 12 karakteres és legfeljebb 72 bájtos legyen.';
            return;
        }

        if (newPassword !== confirmPassword) {
            this.errorMessage = 'Az új jelszavak nem egyeznek.';
            return;
        }

        if (newPassword === currentPassword) {
            this.errorMessage = 'Az új jelszónak különböznie kell a jelenlegitől.';
            return;
        }

        this.isLoading = true;
        this.authService.changePassword(currentPassword, newPassword).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.successMessage = response.message;
                form.reset();
                this.changeDetectorRef.detectChanges();
            },
            error: (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Hiba történt a jelszó megváltoztatásakor.';
                this.changeDetectorRef.detectChanges();
            }
        });
    }
}
