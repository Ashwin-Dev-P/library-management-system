//Filters all the indexes of 'val' in an array 'arr' and returns an array
async function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}


module.exports = {
    getAllIndexes,
}