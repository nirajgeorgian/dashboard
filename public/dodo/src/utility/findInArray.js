function findInArray(obj, arr, value) {
  var length = arr.length;
  for(let i = 0; i < length; i++) {
		if(obj[arr[i]] === value) {
			return arr[i]
    }
  }
	// no result is found
	return "nothing found"
}

export default findInArray
