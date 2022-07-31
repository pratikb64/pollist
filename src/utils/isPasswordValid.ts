/**
 * If the password is not null and has a length greater than or equal to 8, return true, otherwise
 * return false.
 * @param {string} password - string - This is the password that we want to validate.
 * @returns A function that takes a string and returns a boolean.
 */
export default function isPasswordValid(password: string) {
  if (password?.length >= 8) {
    return true;
  }
  return false;
}
