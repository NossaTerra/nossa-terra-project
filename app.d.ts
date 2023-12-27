/* eslint-disable @typescript-eslint/consistent-type-imports */
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/server/api/auth/lucia.js").Auth;
  type UserAttributes = import("./src/server/api/auth/types.js").UserAttributes;
  type DatabaseUserAttributes =
    import("./src/server/api/auth/types.js").UserAttributes;
  type UserRoles = import("./src/server/api/auth/types.js").Role;
}
