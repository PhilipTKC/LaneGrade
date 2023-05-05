import {
  customElement, IPlatform,
} from "aurelia";
import { newInstanceForScope } from "@aurelia/kernel";
import { IRouter, IRouteableComponent } from "aurelia-direct-router";
import { connectTo, Store } from "@aurelia/store-v1";
import { IValidationRules, ValidationResult } from "@aurelia/validation";
import { IValidationController } from "@aurelia/validation-html";

import { DashboardPage } from "pages/protected/dashboard";

import { IAuthenticationService } from "services";
import { FirebaseUser, State } from "common/interfaces";

import { map } from "rxjs/operators";

import template from "./index.html";

@connectTo<State>({
  selector: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  setup: "created",
  target: "firebaseUser",
})
@customElement({ name: "login", template, dependencies: [DashboardPage] })
export class LoginPage implements IRouteableComponent {
  private isLoggingIn = false;

  private isLoginSuccessful: boolean;

  private loginErrors: string[];

  private userCredentials = {
    email: "",
    password: "",
  };

  private firebaseUser: FirebaseUser;

  constructor(
    @IPlatform readonly platform: IPlatform,
    @IAuthenticationService private readonly authenticationService: IAuthenticationService,
    @newInstanceForScope(IValidationController) private readonly validationController: IValidationController,
    @IValidationRules private readonly validationRules: IValidationRules,
    @IRouter private readonly router: IRouter,
    private readonly store: Store<State>,
  ) {
    validationRules
      .on(this.userCredentials)
      .ensure("email")
      .email()
      .required()
      .ensure("password")
      .required();
  }

  canLoad(): any {
    if (this.firebaseUser) {
      return "dashboard";
    }
    return true;
  }

  login(): void {
    this.platform.taskQueue.queueTask(async () => {
      const response = await this.validationController.validate();

      if (!response.valid) {
        this.loginErrors = response
          .results
          .filter((x: ValidationResult) => !x.valid)
          .map((y: ValidationResult) => y.message);
      } else {
        const { email, password } = this.userCredentials;

        this.isLoggingIn = true;

        try {
          const login = await this.authenticationService.login(email, password);

          if (login.user) {
            this.isLoginSuccessful = true;
          }

          // Refactor
          this.platform.setTimeout(async () => {
            this.isLoggingIn = false;
            await this.router.load("dashboard");
          }, 1000);
        } catch (error) {
          if (error.code === "auth/wrong-password") {
            this.loginErrors = ["Email / Password combination is not valid."];
          }
          this.isLoggingIn = false;
        }
      }
    });
  }
}
