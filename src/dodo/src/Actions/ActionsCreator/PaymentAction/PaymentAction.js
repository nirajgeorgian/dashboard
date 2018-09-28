import { PAYMENT_SUCCESSFULL, PAYMENT_FAILED} from '../../ACTION_TYPE/ACTION_TYPE'
import { isLoading } from '../UIActions/isLoading'
import axios from 'axios'

// import { invokeTestApig } from '../../../Config/awsLib'

// const API_KEY = '50d184a4a21a2ce5f20d873de8876c70'
// const AUTH_TOKEN = 'e9944bf8fe93d59e142ca07c98096f56'
const PAYMENT_LINK = 'https://testapi.sagepass.com/business/payment'


const paymentSuccess = () => {
  return {
    type: PAYMENT_SUCCESSFULL
  }
}

const paymentFailed = () => {
  return {
    type: PAYMENT_FAILED
  }
}

// function createPayment(data){
//   return invokeTestApig({
//     path: '/payment',
//     method: "POST",
//     body: data
//   })
// }


const paymentRequest = (data) => {

  data.amount = Number(data.amount)
  console.log(data);

  return async dispatch => {
    dispatch(isLoading())

    try {
      const request = await createPayment(data)
      console.log(request.payment_request.longurl);
      window.open(request.payment_request.longurl)
      dispatch(isLoading())
    }
    catch(e){
      console.log(e.message);
      dispatch(isLoading())
    }

    // await fetch(PAYMENT_LINK , {
    //   method: 'POST',
    //   body: JSON.stringify(data)
    // }).then((res) => {
    //   console.log(res);
    //   dispatch(isLoading())
    //   dispatch(paymentSuccess())
    //
    // }).catch(err => {
    //   console.log(err);
    //   console.log(err.message);
    //   dispatch(isLoading())
    //   dispatch(paymentFailed())
    // })
    // var xhttp = new XMLHttpRequest();
    // if(xhttp){
    //   xhttp.onreadystatechange = function(){
    //     console.log(this.responseText);
    //   };
    //   xhttp.open('POST' ,PAYMENT_LINK, true);
    //   xhttp.send(data);
    // }

  }
}

export {
  paymentSuccess,
  paymentFailed,
  paymentRequest
}
