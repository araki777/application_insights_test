import { apiClient } from "./base";

type Logs = {
  tables: [{ rows: [] }]
}

export const getLog = async (): Promise<Logs> => {
  try {
    const response = await apiClient.get("/logs");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
}