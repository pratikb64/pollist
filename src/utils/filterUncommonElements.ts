/**
 * It takes two arrays and returns an array of elements that are in the first array but not in the
 * second
 * @param array_1 - The first array to be compared.
 * @param array_2 - The array to be filtered.
 * @returns the elements of array_1 that are not in array_2.
 */
const filterUncommonElements = (array_1: Array<any>, array_2: Array<any>) => {
  return array_1.filter(function (e) {
    return array_2.indexOf(e) == -1;
  });
};

export default filterUncommonElements;
