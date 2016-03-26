/* eslint-env mocha */
var path = require('path')
var assetIdEncoder = require(path.join(__dirname, '/../assetIdEncoder'))
var assert = require('assert')

describe('Test Issuance decoder', function () {
  var bitcoinTransaction = {
    'txid': 'bc1083ff98873050d2fa9d38823057f0125161ecad43ab2e2dcd1dd3c2668fb7',
    'ccdata': [{
      'protocol': 17219,
      'version': 1,
      'type': 'issuance',
      'lockStatus': true,
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
    },
    {
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

  describe('1st input pubkeyhash', function () {
    var assetId
    it('should return correct locked aggregatable asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'aggregatable'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'La8kMVUzB9RT2GGKpkpuWJgp1oTPVheheTjMi6')
      console.log(assetId)
      done()
    })

    it('should return correct locked hybrid asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'hybrid'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'LhANhrERyCPXq5b4ZC92LtYSdJ8Xbsu18G1pHy')
      console.log(assetId)
      done()
    })

    it('should return correct locked dispersed asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'dispersed'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ld7CtQsq1dSsN54B8i9j1nPtMHCiYKDXDZ6YBq')
      console.log(assetId)
      done()
    })

    it('should return correct unlocked aggregatable asset ID', function (done) {
      bitcoinTransaction.ccdata[0].lockStatus = false
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'aggregatable'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ua3Kt8WJtsx61VC8DUJiRmseQ45NfW2eJXbbE8')
      console.log(assetId)
      done()
    })

    it('should return correct unlocked hybrid asset ID from scriptSig.asm', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'hybrid'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Uh4xEVFkgvvApJWrwucqGMjH1YkWmgGwizurnM')
      console.log(assetId)
      done()
    })

    it('should return correct unlocked dispersed asset ID from scriptSig.asm', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'dispersed'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ud9d5N9NVkLfNCCc3ExquxPQUbimDEV3ctXUKS')
      console.log(assetId)
      done()
    })
  })

  describe('1st input scripthash', function () {
    var bitcoinTransaction = {
      ccdata: [{
        type: 'issuance',
        aggregationPolicy: 'aggregatable',
        divisibility: 3,
        lockStatus: true
      }],
      vin: [{
        txid: '0f45f38a8bcd8331877267e0f3f5f8a4b3c716165e40db4eee34d52759ad954f',
        vout: 2,
        scriptSig: {
          hex: '0047304402207515cf147d201f411092e6be5a64a6006f9308fad7b2a8fdaab22cd86ce764c202200974b8aca7bf51dbf54150d3884e1ae04f675637b926ec33bf75939446f6ca2801483045022100ef253c1faa39e65115872519e5f0a33bbecf430c0f35cf562beabbad4da24d8d02201742be8ee49812a73adea3007c9641ce6725c32cd44ddb8e3a3af460015d14050147522102359c6e3f04cefbf089cf1d6670dc47c3fb4df68e2bad1fa5a369f9ce4b42bbd1210395a9d84d47d524548f79f435758c01faec5da2b7e551d3b8c995b7e06326ae4a52ae',
          asm: 'OP_0 304402207515cf147d201f411092e6be5a64a6006f9308fad7b2a8fdaab22cd86ce764c202200974b8aca7bf51dbf54150d3884e1ae04f675637b926ec33bf75939446f6ca2801 3045022100ef253c1faa39e65115872519e5f0a33bbecf430c0f35cf562beabbad4da24d8d02201742be8ee49812a73adea3007c9641ce6725c32cd44ddb8e3a3af460015d140501 522102359c6e3f04cefbf089cf1d6670dc47c3fb4df68e2bad1fa5a369f9ce4b42bbd1210395a9d84d47d524548f79f435758c01faec5da2b7e551d3b8c995b7e06326ae4a52ae'
        }
      }]
    }
    var assetId

    it('should return correct locked aggregatable asset ID', function (done) {
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'La8kMVUzB9RT2GGKpkpuWJgp1oTPVheheTjMi6')
      console.log(assetId)
      done()
    })

    it('should return correct locked hybrid asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'hybrid'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'LhANhrERyCPXq5b4ZC92LtYSdJ8Xbsu18G1pHy')
      console.log(assetId)
      done()
    })

    it('should return correct locked dispersed asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'dispersed'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ld7CtQsq1dSsN54B8i9j1nPtMHCiYKDXDZ6YBq')
      console.log(assetId)
      done()
    })

    it('should return correct unlocked aggregatable asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'aggregatable'
      bitcoinTransaction.ccdata[0].lockStatus = false
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ua3gB6zfKRDzNHoQ9V84V7K2zkYmjKnr77D2rk')
      console.log(assetId)
      done()
    })

    it('should return correct unlocked hybrid asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'hybrid'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Uh5JXTk77UC5B788svSBKhAfcFDuqW39Z36n5Z')
      console.log(assetId)
      done()
    })

    it('should return correct unlocked dispersed asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'dispersed'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ud9yNLdivHcZizosyFnByHpo5JCAH4FFUyFSTo')
      console.log(assetId)
      done()
    })
  })

  describe('create assetID from previous output', function () {
    var bitcoinTransaction = {
      ccdata: [{
        type: 'issuance',
        aggregationPolicy: 'aggregatable',
        divisibility: 3,
        lockStatus: false
      }],
      vin: [{
        txid: '0f45f38a8bcd8331877267e0f3f5f8a4b3c716165e40db4eee34d52759ad954f',
        vout: 2,
        previousOutput: {
          asm: 'OP_DUP OP_HASH160 ee54bdd81113a2a8f02cd0dcdd1fa8b14c523fd9 OP_EQUALVERIFY OP_CHECKSIG'
        }
      }]
    }
    var assetId

    it('should return correct unlocked aggregatable asset ID', function (done) {
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ua9CgfGFKCVRdV4aUj4hYz2XtxCg4Smpu8TVAQ')
      console.log(assetId)
      done()
    })

    it('should return correct unlocked hybrid asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'hybrid'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ua9CgfGFKCVRdV4aUj4hYz2XtxCg4Smpu8TVAQ')
      console.log(assetId)
      done()
    })

    it('should return correct unlocked dispersed asset ID', function (done) {
      bitcoinTransaction.ccdata[0].aggregationPolicy = 'dispersed'
      assetId = assetIdEncoder(bitcoinTransaction)
      assert.equal(assetId, 'Ua9CgfGFKCVRdV4aUj4hYz2XtxCg4Smpu8TVAQ')
      console.log(assetId)
      done()
    })
  })
})
