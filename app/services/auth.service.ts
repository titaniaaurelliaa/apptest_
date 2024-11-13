import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import { User } from '../models/types';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username: string, password: string): Promise<User> {
    try {
      const auth = firebase().auth();
      const result = await auth.signInWithEmailAndPassword(username, password);
      // Fetch user details from Firestore
      // Set currentUser
      return this.currentUser;
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }

  async logout(): Promise<void> {
    const auth = firebase().auth();
    await auth.signOut();
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  hasPermission(requiredRole: string[]): boolean {
    if (!this.currentUser) return false;
    return requiredRole.includes(this.currentUser.role);
  }
}