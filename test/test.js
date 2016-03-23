/* eslint-env mocha */
var path = require('path')
var assetId = require(path.join(__dirname, '/../assetIdEncoder'))
var assert = require('assert')
var assetId1, assetId2, assetId3

describe('Test Issuance decoder', function () {
  var bitcoinTransaction = {
   'txid': 'bc1083ff98873050d2fa9d38823057f0125161ecad43ab2e2dcd1dd3c2668fb7',
   'ccdata': [{
       'protocol': 17219,
       'version': 1,
       'type': 'issuance',
       'lockStatus': false,
       'aggregationPolicy': 'aggregatable',
       'divisibility': 3,
       'amount': 1,
       'payments': [{
           'input': 0,
           'amount': 1,
           'output': 0,
           'range': false,
           'percent': false
         }]
     }],
   'iosparsed': false,
   'time': null,
   'blockheight': -1,
   'blocktime': null,
   'vout': [{
       'value': 600,
       'n': 0,
       'scriptPubKey': {
         'asm': 'OP_DUP OP_HASH160 5c7432e747af0d7e8f60de97d5ddd30ec1d9c726 OP_EQUALVERIFY OP_CHECKSIG',
         'hex': '76a9145c7432e747af0d7e8f60de97d5ddd30ec1d9c72688ac',
         'reqSigs': 1,
         'type': 'pubkeyhash',
         'addresses': ['mowofLeEYcoxdneKmy2mkLyVLDr3yoHbdt']
       }
     }, {
       'value': 0,
       'n': 1,
       'scriptPubKey': {
         'asm': 'OP_RETURN 4343010501000100',
         'hex': '6a084343010501000100',
         'type': 'nulldata',
         'addresses': []
       }
     }, {
       'value': 67996800,
       'n': 2,
       'scriptPubKey': {
         'asm': 'OP_DUP OP_HASH160 b8df2b3d4ca896915875afeda7730be816559df6 OP_EQUALVERIFY OP_CHECKSIG',
         'hex': '76a914b8df2b3d4ca896915875afeda7730be816559df688ac',
         'reqSigs': 1,
         'type': 'pubkeyhash',
         'addresses': ['mxNTyQ3WdFMQE7SGVpSQGXnSDevGMLq7dg']
       }
     }],
   'vin': [{
       'txid': '0f45f38a8bcd8331877267e0f3f5f8a4b3c716165e40db4eee34d52759ad954f',
       'vout': 2,
       'sequence': 4294967295.0,
       'value': 67998400,
       'fixed': true,
       'addresses': ['mxNTyQ3WdFMQE7SGVpSQGXnSDevGMLq7dg'],
       'scriptSig': {
         'asm': '3045022100daf8f8d65ea908a28d90f700dc932ecb3b68f402b04ba92f987e8abd7080fcad02205ce81b698b8013b86813c9edafc9e79997610626c9dd1bfb49f60abee9daa43801 029b622e5f0f87f2be9f23c4d82f818a73e258a11c26f01f73c8b595042507a574',
         'hex': '483045022100daf8f8d65ea908a28d90f700dc932ecb3b68f402b04ba92f987e8abd7080fcad02205ce81b698b8013b86813c9edafc9e79997610626c9dd1bfb49f60abee9daa4380121029b622e5f0f87f2be9f23c4d82f818a73e258a11c26f01f73c8b595042507a574'
       }
     }],
   'version': 1,
   'hex': '01000000014f95ad5927d534ee4edb405e1616c7b3a4f8f5f3e06772873183cd8b8af3450f020000006b483045022100daf8f8d65ea908a28d90f700dc932ecb3b68f402b04ba92f987e8abd7080fcad02205ce81b698b8013b86813c9edafc9e79997610626c9dd1bfb49f60abee9daa4380121029b622e5f0f87f2be9f23c4d82f818a73e258a11c26f01f73c8b595042507a574ffffffff0358020000000000001976a9145c7432e747af0d7e8f60de97d5ddd30ec1d9c72688ac00000000000000000a6a084343010501000100808c0d04000000001976a914b8df2b3d4ca896915875afeda7730be816559df688ac00000000'
  }
  it('should return Unlocked aggregatableasset ID from scriptSig.asm', function (done) {
    assetId1 = assetId(bitcoinTransaction)
    assert.equal(assetId1, 'Ua6d5eyBvWE8oros8mBtMoyjWhzeopVJ9aEfyB', 'Should be Unlocked and aggregatable')
    console.log(assetId1)
    done()
  })

  it('should return Unlocked hybrid asset ID from scriptSig.asm', function (done) {
    bitcoinTransaction.ccdata[0].aggregationPolicy = 'hybrid'
    assetId1 = assetId(bitcoinTransaction)
    assert.equal(assetId1, 'Uh8FS1idiZCDcg8bsCW1CPqN8CfnuzjbaXEXGn', 'Should be Unlocked and hybrid')
    console.log(assetId1)
    done()
  })

  it('should return Unlocked dispersed asset ID from scriptSig.asm', function (done) {
    bitcoinTransaction.ccdata[0].aggregationPolicy = 'dispersed'
    assetId1 = assetId(bitcoinTransaction)
    assert.equal(assetId1, 'UdCvGtcFXNciAZpLxXr1qzVVbFe3MYwhUg55vA', 'Should be Unlocked and dispersed')
    console.log(assetId1)
    done()
  })

  it('should return Locked aggregatable asset ID', function (done) {
    bitcoinTransaction.ccdata[0].lockStatus = true
    bitcoinTransaction.ccdata[0].aggregationPolicy = 'aggregatable'
    assetId2 = assetId(bitcoinTransaction)
    assert.equal(assetId2, 'La8VDdCe7uWoL1igL5guQq2v2wf68ViJiK9gFe', 'Should be Locked and aggregatable')
    console.log(assetId2)
    done()
  })

  it('should return Locked hybrid asset ID', function (done) {
    bitcoinTransaction.ccdata[0].aggregationPolicy = 'hybrid'
    assetId2 = assetId(bitcoinTransaction)
    assert.equal(assetId2, 'LhA7Zyx5uxUt8q3R4X12FQtYeSLEEfxc9chGYo', 'Should be Locked and hybrid')
    console.log(assetId2)
    done()
  })

  it('should return Locked dispersed asset ID', function (done) {
    bitcoinTransaction.ccdata[0].aggregationPolicy = 'dispersed'
    assetId2 = assetId(bitcoinTransaction)
    assert.equal(assetId2, 'Ld6wkYbUxPYDfpWXe31ivJjzNRQRB7H8Jx7tYT', 'Should be Locked and dispersed')
    console.log(assetId2)
    done()
  })

  it('should return Locked asset ID', function (done) {
    bitcoinTransaction = {
      ccdata: [{
        type: 'issuance',
        aggregationPolicy: 'aggregatable',
        lockStatus: true
      }],
      vin: [{
        txid: '0f45f38a8bcd8331877267e0f3f5f8a4b3c716165e40db4eee34d52759ad954f',
        vout: 2
      }]
    }
    assetId3 = assetId(bitcoinTransaction)
    assert.equal(assetId3, 'La8VDdCe7uWoL1igL5guQq2v2wf68ViJR8dpDe', 'Should be Locked and aggregatable')
    console.log(assetId3)
    done()
  })
})
