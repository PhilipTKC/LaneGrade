import {
  lifecycleHooks, NavigationInstruction, Params,
} from "aurelia";

// import { RoutingInstruction } from "aurelia-direct-router";
import { FirebaseUser } from "common/interfaces";

@lifecycleHooks()
export class AuthGuard { // implements ILifecycleHooks<IRouteViewModel, "canLoad">
  private firebaseUser: FirebaseUser = null;

  canLoad(
    vm: any,
    params: Params,
    instruction,
  ): boolean | NavigationInstruction {
    let isProtected: boolean;

    if (instruction.route && instruction.route.match) {
      isProtected = instruction.route.match.data.isProtected;
    }

    if (instruction.route && isProtected === undefined) {
      isProtected = instruction.route.data.isProtected;
    }

    if (!instruction.route) {
      return true;
    }

    const { firebaseUser } = vm;

    if (!firebaseUser && isProtected) {
      return "login";
    }

    if (firebaseUser && !isProtected) {
      return "dashboard";
    }

    return true;
  }
}
