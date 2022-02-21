export const findDuplicates = (array: any[]) => {
  var valueArr = array.map((item) => item);
  var hasDuplicate = valueArr.some(
    (item, idx) => valueArr.indexOf(item) != idx
  );

  return hasDuplicate;
};
