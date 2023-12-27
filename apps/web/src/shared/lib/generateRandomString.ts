export const generateRandomString = (len: number) =>
  btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(len))),
  ).substring(0, len);
