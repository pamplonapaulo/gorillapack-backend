'use strict';

import { buildBlob } from '../utils/buildBlob';

const axios = require('axios');

export const removeBlankQuotations = (arr) => {
  let blanks = 0
  for (let i = 0; i < arr.length; i++) {
    if (!!arr[i].error) {
      blanks++
    }
  }
  arr.splice(0, blanks);
  return arr[0]
}

export const sortByLowestPrice = (quotations) => {
  const newArr = quotations.sort(function (a, b) {
    return a.custom_price - b.custom_price
  })
  return newArr
}

const calculateShipping = async (creds) => {
  const mock = {
    from: {
      postal_code: '20756190'
    },
    to: {
      postal_code: '70070-130'
    },
    products: [
      {
        id: 'x',
        width: 6,
        height: 6,
        length: 3,
        weight: 0.05,
        insurance_value: 0,
        quantity: 1
      },
      {
        id: 'y',
        width: 6,
        height: 6,
        length: 3,
        weight: 0.05,
        insurance_value: 0,
        quantity: 1
      },
      {
        id: 'z',
        width: 6,
        height: 6,
        length: 3,
        weight: 0.05,
        insurance_value: 0,
        quantity: 1
      }
    ]
  };

  const calculate = {
    url: 'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${'force-error-' + creds.access_token}`
    },
    data: {
      ...mock
    }
  };

  try {
    const obj = await axios(calculate)
    // const myBlob = new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});
    // const init = { "status" : 200 , "message" : "success" };
    // const response = new Response(myBlob,init);
    // return response
    return await buildBlob(obj)
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
}

const refreshToken = async (creds) => {
  const refresh = {
    url: 'https://sandbox.melhorenvio.com.br/oauth/token',
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    data: {
      'grant_type': 'refresh_token',
      'refresh_token': `Bearer ${creds.refresh_token}`,
      'client_id': creds.client_id,
      'client_secret': creds.client_secret
    },
    // redirect: 'follow'
  };

  try {
    const obj = await axios(refresh)
    return buildBlob(obj)
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
}

export const sendRequest = async (creds, type) => {
  if (type === 'shipping_calculate') {
    return calculateShipping(creds)
  }

  if (type === 'refresh_token') {
    return refreshToken(creds)
  }
}
