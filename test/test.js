var assetId = require(__dirname + '/../assetIdEncoder')
var assert = require('assert')
var assetId1, assetId2, assetId3

describe('Test Issuance decoder', function () {
  var bitcoinTransaction = {
   'txid': 'bc1083ff98873050d2fa9d38823057f0125161ecad43ab2e2dcd1dd3c2668fb7',
   'cc_metadata': [{
       'protocol': 17219,
       'version': 1,
       'type': 'issuance',
       'lockStatus': false,
       'divisibility': 0,
       'amount': 1,
       'payments': [{
           'input': 0,
           'amountOfUnits': 1,
           'output': 0,
           'range': false,
           'precent': false
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
  it('should return Unlocked asset ID from scriptSig.asm', function (done) {
    assetId1 = assetId(bitcoinTransaction)
    assert.equal(assetId1[0], 'U', 'Should be Unlocked')
    // console.log(assetId(bitcoinTransaction))
    done()
  })

  it('should return Locked asset ID', function (done) {
    bitcoinTransaction.cc_metadata.lockStatus = true
    assetId2 = assetId(bitcoinTransaction)
    assert.equal(assetId2[0], 'L', 'Should be Locked')
    // console.log(assetId(bitcoinTransaction))
    done()
  })

  it('should return Unlocked asset ID from testnet address', function (done) {
    bitcoinTransaction = {
      cc_metadata:
        [{
          type: 'issuance',
          lockStatus: false
        }],
      vin:
      [{ txid: '095d3352d3c54b435d833be5d78016e3daa49b137a20c2941ed80214b519ecbe',
        vout: 2,
        address: 'mxNTyQ3WdFMQE7SGVpSQGXnSDevGMLq7dg'
      }]
    }
    assetId3 = assetId(bitcoinTransaction)
    assert.equal(assetId3[0], 'U', 'Should be Unlocked')
    assert.equal(assetId3, assetId1, 'Should get the same assetId from public key or asset')
    // console.log(assetId(bitcoinTransaction))
    done()
  })

  it('should return Unrecognized address network Error', function (done) {
    bitcoinTransaction = {
      cc_metadata:
        [{
          type: 'issuance',
          lockStatus: false
        }],
      vin:
      [{ txid: '095d3352d3c54b435d833be5d78016e3daa49b137a20c2941ed80214b519ecbe',
        vout: 2,
        address: 'fxNTyQ3WdFMQE7SGVpSQGXnSDevGMLq7dg'
      }]
    }
    assert.throws(function () {
      assetId(bitcoinTransaction)
    }
    , 'Unrecognized address network'
    , 'Unrecognized address network')
    done()
  })

  it('should return Unlocked asset ID from mainnet address', function (done) {
    bitcoinTransaction = {
      cc_metadata:
        [{
          type: 'issuance',
          lockStatus: false
        }],
      vin:
      [{ txid: '095d3352d3c54b435d833be5d78016e3daa49b137a20c2941ed80214b519ecbe',
        vout: 2,
        address: '1PuKhp9CmFL9Xs2apKKeTAtLoZPcvoikE1'
      }]
    }
    assetId3 = assetId(bitcoinTransaction)
    assert.equal(assetId3[0], 'U', 'Should be Unlocked')
    // console.log(assetId3)
    done()
  })

  it('should return Unlocked asset ID from mainnet script address', function (done) {
    bitcoinTransaction = {
      cc_metadata:
        [{
          type: 'issuance',
          lockStatus: false
        }],
      vin:
      [{ txid: '095d3352d3c54b435d833be5d78016e3daa49b137a20c2941ed80214b519ecbe',
        vout: 2,
        address: '3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX'
      }]
    }
    assetId3 = assetId(bitcoinTransaction)
    assert.equal(assetId3[0], 'U', 'Should be Unlocked')
    // console.log(assetId3)
    done()
  })

  it('should return Unlocked asset ID from testnet script address', function (done) {
    bitcoinTransaction = {
      cc_metadata:
        [{
          type: 'issuance',
          lockStatus: false
        }],
      vin:
      [{ txid: '095d3352d3c54b435d833be5d78016e3daa49b137a20c2941ed80214b519ecbe',
        vout: 2,
        address: '2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc'
      }]
    }
    assetId3 = assetId(bitcoinTransaction)
    assert.equal(assetId3[0], 'U', 'Should be Unlocked')
    // console.log(assetId3)
    done()
  })

})
