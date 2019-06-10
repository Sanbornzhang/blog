function encryptStringWithXORtoHex(text, secret) {
  while (secret.length < text.length) {
    secret += secret
  }
  return text
    .split('')
    .map((v, i) => (v.charCodeAt(0) ^ secret[i].charCodeAt(0)).toString('16'))
    .join('|')
}

function decryptHexStringWithXOR(encryptText, secret) {
  return encryptText
    .split('|')
    .map((v, i) => (String.fromCharCode(
      (parseInt(v, 16)) ^ secret.charCodeAt(i)))).join('')
}
encode = encryptStringWithXORtoHex("aaa", "ssss")
console.log(encode)
console.log(decryptHexStringWithXOR(encode, 'ssss'))