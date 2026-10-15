/**
 * Rsbuild types: import.meta.env, asset imports (.svg/.css/...), process.env.
 *
 * Remote module types are not declared here. Module Federation generates them into
 * `@mf-types/` from each remote's real exposes (see `tsconfig.json` `paths`), so a
 * changed remote signature shows up as a type error in the host.
 */
/// <reference types="@rsbuild/core/types" />
