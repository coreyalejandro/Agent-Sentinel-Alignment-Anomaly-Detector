declare global {
  var __APP_ENV__: Record<string, unknown> | undefined;
}

if (typeof globalThis !== 'undefined') {
  globalThis.__APP_ENV__ = {
    ...(globalThis.__APP_ENV__ || {}),
    ...import.meta.env,
  };
}

export {};
