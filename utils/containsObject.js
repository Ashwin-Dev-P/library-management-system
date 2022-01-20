module.exports = async function containsObject(obj, list) {
    var i;

    if (!list) {
        list = []
    }
    for (i = 0; i < list.length; i++) {


        if (String(list[i]) == String(obj)) {
            return true;
        }
    }

    return false;
}