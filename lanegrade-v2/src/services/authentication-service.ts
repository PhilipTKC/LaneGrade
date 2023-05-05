import { DI } from "aurelia";

import {
  auth, signInWithEmailAndPassword, signOut, UserCredential,
} from "configurations/firebase";

export const IAuthenticationService = DI
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  .createInterface<IAuthenticationService>("IAuthenticationService", (x) => x.singleton(AuthenticationService));

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface IAuthenticationService extends AuthenticationService {}

export class AuthenticationService {
  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<any> {
    return auth.currentUser;
  }
}
