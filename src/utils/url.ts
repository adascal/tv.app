export const queryToObject = (query: string) => {
  return Object.fromEntries(new URLSearchParams(query).entries());
};

export const fixProtocol = (url?: string) => {
  return url ? url.replace(/^https?:/, window.location.protocol) : '';
};
