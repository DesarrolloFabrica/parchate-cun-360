declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.webp';
declare module '*.svg?raw' {
  const content: string;
  export default content;
}
declare module '*.json' {
  const value: unknown;
  export default value;
}
