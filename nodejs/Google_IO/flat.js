flat = function(arr){
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr
}
const array =  [1, [2, [3, 4]]]
console.log(flat(array))

