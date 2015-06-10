var cs = require('coinstring')
var hash = require('crypto-hashing')
var UNLOCKEPADDING = 0x44
var LOCKEPADDING = 0x30
var TESTNET = 0x6f
var MAINNET = 0x00

var createId = function (publicKey, padding) {
  if (!Buffer.isBuffer(publicKey)) {
    publicKey = new Buffer(publicKey, 'hex')
  }
  var hash256 = hash.sha256(publicKey)
  var hash160 = hash.ripemd160(hash256)
  var hash160Buf = new Buffer(hash160, 'hex')
  var assetId = cs.encode(hash160Buf, padding)
  return assetId
}

var createIdFromAddress = function (address, padding) {
  var firstChar = address.slice(0, 1)
  var version
  switch (firstChar) {
    case '1':
        version = MAINNET
        break
    case 'm':
        version = TESTNET
        break
    default:
        throw new Error('Unrecognized address network')
  }
  return cs.encode(cs.decode(address, version), padding)
}

module.exports = function (bitcoinTransaction) {
  if (!bitcoinTransaction.cc_metadata) throw new Error('Missing Colored Coin Metadata')
  if (bitcoinTransaction.cc_metadata[0].type !== 'issuance') throw new Error('Not An issuance transaction')
  if (typeof bitcoinTransaction.cc_metadata[0].lockStatus === 'undefined') throw new Error('Missing Lock Status data')
  var lockStatus = bitcoinTransaction.cc_metadata.lockStatus
  var firstInput = bitcoinTransaction.vin[0]
  if (lockStatus) return createId(firstInput.txid + '-' + firstInput.vout, LOCKEPADDING)
  if (firstInput.scriptSig && firstInput.scriptSig.asm) return createId(firstInput.scriptSig.asm.split(' ')[1], UNLOCKEPADDING)
  if (firstInput.address) return createIdFromAddress(firstInput.address, UNLOCKEPADDING)
}
