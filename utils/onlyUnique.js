//used to find unique values in array
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

module.exports = {
    onlyUnique,
}