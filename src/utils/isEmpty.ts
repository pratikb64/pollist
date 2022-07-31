/**
 * It returns true if the variable is empty, null, or undefined.
 * @param {string | undefined | null} variable - string | undefined | null
 * @returns A function that takes a variable and returns a boolean.
 */
export default function isEmpty(variable: string | undefined | null) {
  let state = false;
  if (variable === '' || variable === null || variable === undefined)
    state = true;
  return state;
}
