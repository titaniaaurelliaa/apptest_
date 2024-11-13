import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { navigate } from '@nativescript/core/ui/frame';

export class LoginViewModel extends Observable {
  private authService = AuthService.getInstance();
  
  username: string = '';
  password: string = '';
  isLoading: boolean = false;

  async onLogin() {
    if (!this.username || !this.password) {
      alert('Please enter username and password');
      return;
    }

    this.set('isLoading', true);

    try {
      await this.authService.login(this.username, this.password);
      navigate({
        moduleName: 'views/dashboard/dashboard-page',
        clearHistory: true
      });
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      this.set('isLoading', false);
    }
  }
}