var cs = require('coinstring')
var hash = require('crypto-hashing')
var UNLOCKEPADDING = 0xc8
var LOCKEPADDING = 0x8e
var NETWORKVERSIONS = [0x00, 0x05, 0x6f, 0xc4]
var POSTFIXBYTELENGTH = 2

var padLeadingZeros = function (hex, byteSize) {
  return (hex.length === byteSize * 2) ? hex : padLeadingZeros('0' + hex, byteSize)
}

var createId = function (publicKey, padding, divisibility) {
  divisibility = divisibility || 0
  divisibility = new Buffer(padLeadingZeros(divisibility.toString(16), POSTFIXBYTELENGTH), 'hex')
  if (!Buffer.isBuffer(publicKey)) {
    publicKey = new Buffer(publicKey, 'hex')
  }
  var hash256 = hash.sha256(publicKey)
  var hash160 = hash.ripemd160(hash256)
  var hash160Buf = new Buffer(hash160, 'hex')
  hash160Buf = Buffer.concat([hash160Buf, divisibility])
  return cs.encode(hash160Buf, padding)
}

var createIdFromAddress = function (address, padding, divisibility) {
  divisibility = divisibility || 0
  divisibility = new Buffer(padLeadingZeros(divisibility.toString(16), POSTFIXBYTELENGTH), 'hex')
  address = cs.decode(address)
  var version = address.slice(0, 1)
  // if (version[0] === 4) version = address.slice(0, 4)
  var hash160Buf = address.slice(version.length, 21)
  if (NETWORKVERSIONS.indexOf(parseInt(version.toString('hex'), 16)) === -1) throw new Error('Unrecognized address network')
  hash160Buf = Buffer.concat([hash160Buf, divisibility])
  return cs.encode(hash160Buf, padding)
}

module.exports = function (bitcoinTransaction) {
  if (!bitcoinTransaction.cc_data) throw new Error('Missing Colored Coin Metadata')
  if (bitcoinTransaction.cc_data[0].type !== 'issuance') throw new Error('Not An issuance transaction')
  if (typeof bitcoinTransaction.cc_data[0].lockStatus === 'undefined') throw new Error('Missing Lock Status data')
  var lockStatus = bitcoinTransaction.cc_data[0].lockStatus
  var firstInput = bitcoinTransaction.vin[0]
  if (lockStatus) return createId(firstInput.txid + '-' + firstInput.vout, LOCKEPADDING, bitcoinTransaction.cc_data[0].divisibility)
  if (firstInput.scriptSig && firstInput.scriptSig.asm) return createId(firstInput.scriptSig.asm.split(' ')[1], UNLOCKEPADDING, bitcoinTransaction.cc_data[0].divisibility)
  if (firstInput.address) return createIdFromAddress(firstInput.address, UNLOCKEPADDING, bitcoinTransaction.cc_data[0].divisibility)
}
