import { SemVer, ReleaseType } from "semver";
export declare const prefix: (ver: string) => string;
export declare const version: (value: SemVer | string, type?: string | undefined, pre?: string | undefined) => SemVer;
export declare const bump: (value: SemVer | string, type: ReleaseType, pre?: string | undefined) => SemVer | null;
export { coerce } from 'semver';
export default version;
