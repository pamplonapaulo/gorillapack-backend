import { request } from "@strapi/helper-plugin";
import pluginId from "../pluginId";

export const fetchCredentials = async () => {
  try {
    const data = await request(`/${pluginId}/credentials`, { method: "GET" });
    console.log('fetchCredentials')
    console.log(data)
    return data;
  } catch (error) {
    console.log(error)
    return null;
  }
};
