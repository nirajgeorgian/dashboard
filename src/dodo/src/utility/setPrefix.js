function getObjectWithChangedKey(item, keyword) {
    var tmp = {}
    var keys = Object.keys(item)
    for (var j = 0; j < keys.length; j++) {
        var key = keys[j].replace('', keyword)
        var _key = keys[j]
        switch (typeof item[_key]) {
            case 'object':
                if (item[_key] != null) {
                    if (item[_key].constructor !== Array) {
                        var keys1 = Object.keys(item[_key])
                        for (var i = 0; i < keys1.length; i++) {
                            var key1 = key + '_' + keys1[i]
                            tmp[key1] = item[_key][keys1[i]]
                        }
                    } else {
                        tmp[key] = item[_key]
                    }
                } else {
                    tmp[key] = item[_key]
                }
                break

            default:
                tmp[key] = item[_key]
                break
        }
    }
    return tmp
}

export default getObjectWithChangedKey