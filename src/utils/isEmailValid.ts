/**
 * It checks if the email is valid by checking if it contains an @ symbol, a period, and at least one
 * character before and after the @ symbol
 * @param {string} email - The email address to validate.
 * @returns A boolean value.
 */
export default function isEmailValid(email: string) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
