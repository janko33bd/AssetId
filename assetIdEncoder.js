var crypto = require('crypto')
var cs = require('coinstring')

var createId = function (publicKey, padding) {
  if (!Buffer.isBuffer(publicKey)) {
    publicKey = new Buffer(publicKey, 'hex')
  }
  var hash256 = crypto.createHash('sha256').update(publicKey).digest('hex')
  var hash160 = crypto.createHash('ripemd160').update(hash256).digest('hex')
  var hash160Buf = new Buffer(hash160, 'hex')
  var assetId = cs.encode(hash160Buf, padding)

  return assetId
}

module.exports = function (bitcoinTransaction) {
  if (!bitcoinTransaction.cc_metadata) throw new Error('Missing Colored Coin Metadata')
  if (bitcoinTransaction.cc_metadata[0].type !== 'issuance') throw new Error('Not An issuance transaction')
  if (typeof bitcoinTransaction.cc_metadata[0].lockStatus === 'undefined') throw new Error('Missing Lock Status data')
  var lockStatus = bitcoinTransaction.cc_metadata.lockStatus
  var firstInput = bitcoinTransaction.vin[0]
  if (lockStatus) {
    return createId(firstInput.txid + '-' + firstInput.vout, 0x30)
  }
  return createId(firstInput.scriptSig.asm.split(' ')[1], 0x44)
}
