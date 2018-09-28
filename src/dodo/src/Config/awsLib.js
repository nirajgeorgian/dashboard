import crypto from 'crypto'
import AWS from 'aws-sdk'
import { CognitoUserPool } from 'amazon-cognito-identity-js'
import axios from 'axios'
import config from './AwsConfig'
import userPool from './userPool'
import sigV4Client from './sigv4Client'
import { Storae } from 'aws-amplify'

// userpoll login credentials

export function getCurrentUser() {
	return userPool.getCurrentUser()
}

// facebook login credentials

function getUserToken(currentUser) {
	return new Promise((resolve, reject) => {
		currentUser.getSession(function(err, session) {
			if (err) {
				reject(err)
				return
			}
			resolve(session.getIdToken().getJwtToken())
		})
	})
}

export async function signOutUser() {
	const currentUser = getCurrentUser()
	if (currentUser !== null) {
		currentUser.signOut()
	}
	// check for existing aws credentials
	if (AWS.config.credentials) {
		// console.log(AWS.config.credentials)
		// if it exists remove it
		await AWS.config.credentials.clearCachedId()
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({})
	}
}

function getAwsCredentials(userToken) {
	const authenticator = `cognito-idp.${config.REGION}.amazonaws.com/${
		config.cognito.USER_POOL_ID
	}`
	AWS.config.update({
		region: config.REGION
	})
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: config.IDENTITY_POOL_ID,
		Logins: {
			[authenticator]: userToken
		}
	})
	// return new Promise((resolve, reject) => {
	//   if(AWS.config.credentials) {
	//     resolve(AWS.config.credentials)
	//   }
	//   reject("User not found")
	// })
	return AWS.config.credentials.getPromise()
}

export async function authUser() {
	// console.log(AWS.config.credentials);
	if (
		AWS.config.credentials &&
		Date.now() < AWS.config.credentials.expireTime - 6000
	) {
		return true
	}
	const currentUser = getCurrentUser()
	if (currentUser === null) {
		return false
	}
	const userToken = await getUserToken(currentUser)

	const user = await getAwsCredentials(userToken)
	// console.log(user)
	// getAwsCredentials(userToken)
	// .then(res => {
	//   // console.log(res)
	//   return true
	// })
	return true
}

export async function invokeApig({
	path,
	method = 'GET',
	headers = {},
	queryParams = {},
	body
}) {
	if (!(await authUser())) {
		throw new Error('User is not logged in')
	}
	// console.log(config.apiGateway.URL);
	// console.log(AWS.config.credentials.sessionToken);
	// console.log('param body: ', body)
	const signedRequest = sigV4Client
		.newClient({
			accessKey: AWS.config.credentials.accessKeyId,
			secretKey: AWS.config.credentials.secretAccessKey,
			sessionToken: AWS.config.credentials.sessionToken,
			region: config.apiGateway.REGION,
			endpoint: config.apiGateway.TESTURL
		})
		.signRequest({
			method,
			path,
			headers,
			queryParams,
			body
		})
	body = body ? JSON.stringify(body) : body
	headers = signedRequest.headers
	// console.log('signed body: ', body)
	// console.log('headers', headers)
	// console.log(signedRequest.url, " \n" + method + "\n" + headers, " \n" + body);
	const results = await fetch(signedRequest.url, {
		// const results = await axios({
		method,
		headers,
		// url: signedRequest.url,
		body
	})
	// .then(res => console.log(res))
	// .catch(err => console.log("error" + err.message))
	// console.log(results);
	if (results.status !== 200) {
		throw new Error(await results.text())
	}
	return results.json()
}

export async function invokeFacilityApig({
	path,
	method = 'GET',
	headers = {},
	queryParams = {},
	body
}) {
	if (!(await authUser())) {
		throw new Error('User is not logged in')
	}
	// console.log(config.apiGateway.URL);
	// console.log(AWS.config.credentials.sessionToken);
	const signedRequest = sigV4Client
		.newClient({
			accessKey: AWS.config.credentials.accessKeyId,
			secretKey: AWS.config.credentials.secretAccessKey,
			sessionToken: AWS.config.credentials.sessionToken,
			region: config.apiGateway.REGION,
			endpoint: config.apiGateway.FACILITYURL
		})
		.signRequest({
			method,
			path,
			headers,
			queryParams,
			body
		})
	// console.log(signedRequest)
	body = body ? JSON.stringify(body) : body
	headers = signedRequest.headers
	// console.log(headers);
	// console.log(signedRequest.url, " \n" + method + "\n" + headers, " \n" + body);
	const results = await fetch(signedRequest.url, {
		// const results = await axios({
		method,
		headers,
		// url: signedRequest.url,
		body
	})
	// .then(res => console.log(res))
	// .catch(err => console.log("error" + err.message))
	// console.log(results);
	if (results.status !== 200) {
		throw new Error(await results.text())
	}
	return results.json()
}

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

export async function s3Upload(file, folder) {
	if (!(await authUser())) {
		throw new Error('User is not logged in')
	}
	// if(!file.size < config.MAX_ATTACHMENT_LOGO_FILE) {
	// 	throw new Error("File excedded max file size")
	// }
	const s3 = new AWS.S3({
		params: {
			Bucket: config.s3.SPEED_BUCKET,
			useAccelerateEndpoint: true
		}
	})
	const ext = (file.name.split("."))[1]
	const filename = `${folder}/${randomValueHex(4)}/${Date.now()}.${ext}`
	// console.log(filename);
	return s3
		.upload({
			Key: filename,
			Body: file,
			ContentType: file.type,
			ACL: 'public-read'
		})
		.promise()
}

export async function s3UploadChat(file, folder) {
	if(!(await authUser())) {
		throw new Error('User is not logged in')
	}
	const s3 = new AWS.S3({
		params: {
			Bucket: config.s3.CHAT_BUCKET
		}
	})

	const filename = `${folder}/${file.name}.${file.ext}`;

	return s3
		.upload({
			Key: filename,
			Body: file,
			ContentType: file.type,
			ACL: 'public-read'
		}).promise()
}

export async function publishMessageToSns(message, sender, receiver) {

	if (!(await authUser())) {
		throw new Error('User is not logged in')
	}
	const sns = new AWS.SNS({ region: config.REGION});
  var params = {
    Message: message,
		MessageAttributes: {
			'sender' : {
				DataType: 'String',
				StringValue: sender
			}
		},
    TopicArn: 'arn:aws:sns:eu-west-1:134422165535:sagepass-test-messaging'
  }
  return new Promise((resolve, reject) => {
    sns.publish(params, function(err, data) {
      if(err) {
        console.log(err.message);
        reject(err);
      }
      else {
        console.log(data);
        resolve(data);
      }
    })
  })

}
