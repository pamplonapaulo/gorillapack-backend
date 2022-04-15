import { request } from "@strapi/helper-plugin";
import pluginId from "../pluginId";
import buildBlob from '../utils/buildBlob';

export const fetchCredentials = async () => {
  try {
    const data = await request(`/${pluginId}/credentials`, { method: 'GET' });
    return data;
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
};

export const replaceTokens = async (access_token, refresh_token) => {

  const url = `/${pluginId}/credentials`

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.jwtToken}`
    },
    params: {
      access_token,
      refresh_token
    }
  };

  try {
    const obj = await request(url, options);
    return buildBlob(obj)
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
};
