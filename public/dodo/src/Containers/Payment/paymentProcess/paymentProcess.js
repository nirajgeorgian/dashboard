import crypto from 'crypto'
import { invokeTestApig } from '../../../Config/awsLib'
import config from './config'
import { verifychecksum, genchecksum } from '../checksum'
let algorithm = "aes-256-ctr"
let password = "dodo@N9"
// Request type = "DEFAULT || SUBSCRIBE"

/**
  Mandatory fields {
    order_id
    cust_id
    Industry_type_id
    Channel
    TxtAmount
  }

*/

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

class PaymentProcess {
  constructor(cust_id, email, amount, request_type, timestamp) {
    this.REQUEST_TYPE = 'DEFAULT',
    this.MID = config.MID
    this.ORDER_ID = cust_id + "dad" + (crypto.randomBytes(3)).toString('hex')
    this.CUST_ID = cust_id
    this.TXN_AMOUNT = String(amount)
    this.CHANNEL_ID = config.CHANNEL_ID
    this.INDUSTRY_TYPE_ID = config.INDUSTRY_TYPE
    this.WEBSITE = config.WEBSITE
    this.EMAIL = email
    // this.SUBS_SERVICE_ID = cust_id
    // this.SUBS_AMOUNT_TYPE = "FIX"
    // this.SUBS_FREQUENCY = 1
    // this.SUBS_FREQUENCY_UNIT = "YEAR"
    // this.SUBS_ENABLE_RETRY = 0
    // this.SUBS_EXPIRY_DATE = (new Date(new Date().setFullYear(new Date().getFullYear() + 1))).toJSON().slice(0,10).replace(/-/g,'-')
    // this.MOBILE_NO = "8801881082"
    // this.PAYMENT_MODE_ONLY = "NB"
    // this.AUTH_MODE = "3D",
    // this.CALLBACK_URL = "http://testbusiness.sagepass.com"
    // this.mobile_no = mobile_no
    // this.checksumhash = checksumhash
  }

  returnChecksum() {
    let paramarray = new Array()
    let PAYTM_MERCHANT_KEY = ""
    for(name in this) {
      if(name == 'PAYTM_MERCHANT_KEY') {
        PAYTM_MERCHANT_KEY = this[name]
      } else {
        paramarray[name] = this[name]
      }
    }
    // paramarray['CALLBACK_URL'] = config.TEST_CALLBACK_URL
    return new Promise((resolve, reject) => {
      genchecksum(paramarray, config.MERCHANT_KEY, function(err, data) {
        if (err) reject(err)
        resolve(data)
      })
    })
  }
}

export default PaymentProcess
