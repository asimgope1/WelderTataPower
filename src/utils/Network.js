import { getObjByKey } from './Storage';
export const POSTNETWORK = async (
  url,
  payload,
  token = false,
  content = false,
) => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': content ? 'multipart/form-data' : 'application/json',
  };
  if (token) {
    let loginRes = await getObjByKey('loginResponse');
    headers = { ...headers, Authorization: `Token ${loginRes?.token}` };
  }
  console.log('HEADERS: ', headers);
  return await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('error' + error);
    });
};

export const PUTNETWORK = async (
  url,
  payload,
  token = false,
  content = false,
) => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': content ? 'multipart/form-data' : 'application/json',
  };
  if (token) {
    let loginRes = await getObjByKey('loginResponse');
    headers = { ...headers, Authorization: `Bearer ${loginRes?.token}` };
  }
  // console.log("HEADERS: ", headers);
  return await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('error' + error);
    });
};

export const GETNETWORK = async (url, token = false) => {
  try {
    // Default headers for GET request
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // If a token is required, add the Authorization header
    if (token) {
      const loginRes = await getObjByKey('loginResponse');
      headers = { ...headers, Authorization: `Token ${loginRes?.token}` };
    }

    // Fetch data using the GET method
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    // Parse the response as JSON
    const result = await response.json();

    // Return the result
    return result;
  } catch (error) {
    // Log any errors that occur
    console.error('Error in GETNETWORK:', error);
    throw error; // You can throw the error to handle it outside the function if needed
  }
};

