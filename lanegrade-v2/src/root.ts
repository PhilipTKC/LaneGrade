import {
  IRouterEvents,
} from "@aurelia/router";
import { customElement, ICustomElementViewModel } from "@aurelia/runtime-html";
import { IRouter, routes } from "aurelia-direct-router";
import { Store } from "@aurelia/store-v1";

import { SideNavigationMenuCustomElement } from "components/side-navigation-menu";
import { State } from "common/interfaces";

import nProgress from "nprogress";

import nprogressCSS from "css/nprogress.css";

import themeCSS from "css/theme.css";
// import tippyCSS from "css/tippy.css";
import loaderCSS from "css/loader.css";

import { StoreDispatchActions } from "common/enums";
import { DeleteConfirmationModalCustomElement } from "components";

import template from "./root.html";
import { LoginPage } from "./pages/public/authentication/login";
import { DashboardPage } from "./pages/protected/dashboard";

@customElement({
  name: "root",
  template,
  dependencies: [
    DashboardPage,
    LoginPage,
    SideNavigationMenuCustomElement,
    themeCSS,
    nprogressCSS,
    // tippyCSS,
    loaderCSS,
    DeleteConfirmationModalCustomElement,
  ],
})
@
routes([
  {
    id: "dashboard",
    path: ["", "dashboard"],
    component: import("./pages/protected/dashboard"),
    title: "Dashboard",
    viewport: "root",
    data: { isProtected: true },
  },
  {
    path: "organization",
    component: import("./pages/protected/organization"),
    title: "Organization",
    viewport: "root",
    data: { isProtected: true },
  },
  {
    path: "tasks",
    component: import("./pages/protected/tasks"),
    title: "Tasks",
    viewport: "root",
    data: { isProtected: true },
  },
  {
    path: "account",
    component: import("./pages/protected/account"),
    title: "Account",
    viewport: "root",
    data: { isProtected: true },
  },
  {
    path: "login",
    component: import("./pages/public/authentication/login"),
    title: "Login",
    viewport: "root",
    data: { isProtected: false },
  },
  {
    path: "register",
    component: import("./pages/public/authentication/register"),
    title: "Register",
    viewport: "root",
    data: { isProtected: false },
  },
])
export class Root implements ICustomElementViewModel {
  private state: State;

  constructor(
    @IRouter private readonly router: IRouter,
    @IRouterEvents readonly routerEvents: IRouterEvents,
    private readonly store: Store<State>,
  ) {
    this.store.state.subscribe((state: State) => {
      this.state = state;
    });

    this.subscribeToNavigationStartEvent();
    this.subscribeToNavigationEndEvent();
  }

  subscribeToNavigationStartEvent(): void {
    this.routerEvents.subscribe("au:router:navigation-start", async () => {
      await this.store.dispatch(StoreDispatchActions.setIsChangingRoute, true);
      nProgress.start();
    });
  }

  subscribeToNavigationEndEvent(): void {
    this.routerEvents.subscribe("au:router:navigation-end", async (ev) => {
      console.log(ev)
      await this.store.dispatch(StoreDispatchActions.setIsChangingRoute, false);
      nProgress.done();
    });
  }
}
