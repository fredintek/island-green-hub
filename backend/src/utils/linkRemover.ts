export function linkRemover(target: any, searchString: string): any {
  if (typeof target === 'string') {
    // If the target is a string, check if it matches the input string
    return target === searchString ? null : target;
  }

  if (Array.isArray(target)) {
    // If the target is an array, check if it's an array of strings
    if (typeof target[0] === 'string') {
      // If it's an array of strings, pop the matched string
      const index = target.indexOf(searchString);
      if (index !== -1) {
        target.splice(index, 1); // Remove the matched string
      }
      return target;
    } else {
      // If it's an array of objects, recurse for each item in the array
      // return target.map((item) => linkRemover(item, searchString));

      // If it's an array of objects, remove the object if it contains the search string
      return target.filter((item) => {
        if (typeof item === 'object') {
          // Check if any value in the object contains the search string
          return !Object.values(item).some((value) => value === searchString);
        }
        return true; // Keep the item if it's not an object
      });
    }
  }

  if (typeof target === 'object' && target !== null) {
    // If the target is an object, recurse for each key's value
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        target[key] = linkRemover(target[key], searchString);
      }
    }
    return target;
  }

  // Return the target if none of the conditions are met
  return target;
}
