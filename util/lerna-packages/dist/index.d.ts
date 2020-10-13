export declare type Package = {
    name: string;
    version: string;
    tag: string;
    path: string;
};
export declare type LernaConfig = {
    packages: string[];
};
export declare const getRootPath: () => string;
export declare const getConfig: (path?: string) => {
    packages: string[];
};
export declare const getPackages: (path?: string, { packages }?: Pick<LernaConfig, 'packages'>) => Array<Package>;
export default getPackages;
