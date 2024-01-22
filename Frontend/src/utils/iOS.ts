
export const iOS: boolean =
  typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
