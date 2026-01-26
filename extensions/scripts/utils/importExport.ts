// Convert backslashes to forward slashes for cross-platform compatibility
const normalizePath = (p: string) => p.replace(/\\/g, '/');

export const toNamedDefaultExport = (details: { path: string, name: string }) =>
  `export { default as ${details.name} } from '${normalizePath(details.path)}';`;

export const exportAllFromModule = (path: string) => `export * from '${normalizePath(path)}';`;

export const importStatement = (what: string, where: string) => `import ${what} from '${normalizePath(where)}';`;