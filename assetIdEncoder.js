var bs58check = require('bs58check')
var hash = require('crypto-hashing')
var UNLOCKEPADDING = {
  aggregatable: 0x2e37,
  hybrid: 0x2e6b,
  dispersed: 0x2e4e
}
var LOCKEPADDING = {
  aggregatable: 0x20ce,
  hybrid: 0x2102,
  dispersed: 0x20e4
}
var POSTFIXBYTELENGTH = 2

var padLeadingZeros = function (hex, byteSize) {
  if (!byteSize) {
    byteSize = Math.ceil(hex.length / 2)
  }
  return (hex.length === byteSize * 2) ? hex : padLeadingZeros('0' + hex, byteSize)
}

var createId = function (publicKey, padding, divisibility) {
  divisibility = new Buffer(padLeadingZeros(divisibility.toString(16), POSTFIXBYTELENGTH), 'hex')
  padding = new Buffer(padLeadingZeros(padding.toString(16)), 'hex')
  var hash256 = hash.sha256(publicKey)
  var hash160 = hash.ripemd160(hash256)
  var concatenation = Buffer.concat([padding, hash160, divisibility])
  return bs58check.encode(concatenation)
}

module.exports = function (bitcoinTransaction) {
  if (!bitcoinTransaction.ccdata) throw new Error('Missing Colored Coin Metadata')
  if (bitcoinTransaction.ccdata[0].type !== 'issuance') throw new Error('Not An issuance transaction')
  if (typeof bitcoinTransaction.ccdata[0].lockStatus === 'undefined') throw new Error('Missing Lock Status data')
  var lockStatus = bitcoinTransaction.ccdata[0].lockStatus
  var aggregationPolicy = bitcoinTransaction.ccdata[0].aggregationPolicy || 'aggregatable'
  var divisibility = bitcoinTransaction.ccdata[0].divisibility || 0
  var firstInput = bitcoinTransaction.vin[0]
  if (lockStatus) return createId(firstInput.txid + '-' + firstInput.vout, LOCKEPADDING[aggregationPolicy], divisibility)
  if (firstInput.scriptSig && firstInput.scriptSig.asm) return createId(firstInput.scriptSig.asm.split(' ')[1], UNLOCKEPADDING[aggregationPolicy], divisibility)
}
