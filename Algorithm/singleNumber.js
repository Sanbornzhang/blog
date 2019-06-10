/**
 *  简单的使用HashMap来查询只出现一次的数据
 * @param {*} arr 
 */
function singleNumber(arr = []) {
  const hashMap = {}
  for (const i of arr) {
    if (hashMap[i]) {
      delete hashMap[i]
    } else {
      hashMap[i] = 1
    }
  }
  return Object.keys(hashMap)[0]
}
console.log(singleNumber([1, 2, 1]))

/**
 * 使用位运算
 * @param {*} arr 
 */
function singleNumberBitXOR(arr = []) {
  let res = 0
  for (const i of arr){
    res ^= i
  }
  return res
}
console.log(singleNumberBitXOR([1, 2, 1]))