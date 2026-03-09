// Cookie utilities for cross-subdomain authentication

/**
 * Set a cookie that is accessible across all subdomains
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Expiration in days
 */
export function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Set cookie with Domain=.propella.ng to make it available to all subdomains
  // SameSite=Lax allows the cookie to be sent on top-level navigation
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;domain=.propella.ng;SameSite=Lax`;
}

/**
 * Get a cookie by name
 * @param name - Cookie name
 * @returns Cookie value or null
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

/**
 * Delete a cookie
 * @param name - Cookie name
 */
export function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.propella.ng;SameSite=Lax`;
}

/**
 * Clear all auth cookies
 */
export function clearAuthCookies() {
  deleteCookie("auth_token");
  deleteCookie("access_token");
  deleteCookie("refresh_token");
}
