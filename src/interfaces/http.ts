import axios, { AxiosError } from "axios";

export async function get<ResponseType>(url: string) {
    try {
        const response = await axios.get<ResponseType>(url);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}

export async function post<ResponseType>(url: string, data: any) {
    try {
        const response = await axios.post<ResponseType>(url, data);
        return response.data;
    } catch (error) {
        throw new Error((error as AxiosError).message);
    }
}
