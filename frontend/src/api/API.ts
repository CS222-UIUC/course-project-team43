/*
 * Class that handles all API calls
 */
export const API_URL = 'http://127.0.0.1:8000';
export const actions: APIActions = {
    upload: async (body: FormData) => {
        return await post('upload', body);
    },
};

export async function rawGet(path: string): Promise<Response> {
    const response = await fetch(`${API_URL}/${path}`);
    return response;
}

export async function rawPost(path: string, body: any): Promise<Response> {
    const response = await fetch(`${API_URL}/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    });
    return response;
}

export async function get<T>(path: string): Promise<APIResponse<T>> {
    const response = await rawGet(path);
    const json = await response.json();
    if (response.ok) {
        const responseObject: APIResponse<T> = {
            status: response.status,
            response: json,
            message: json.message != null ? json.message : '',
        };
        return responseObject;
    }
    throw new APIError({
        status: response.status,
        response: json,
        message: json.message != null ? json.message : 'Unknown error',
    });
}

export async function post<T>(path: string, body: any): Promise<APIResponse<T>> {
    const response = await rawPost(path, body);
    const json = await response.json();
    if (response.ok) {
        const responseObject: APIResponse<T> = {
            status: response.status,
            response: json,
            message: json.message != null ? json.message : '',
        };
        return responseObject;
    }
    throw new APIError({
        status: response.status,
        response: json,
        message: json.message != null ? json.message : 'Unknown error',
    });
}

export class APIError extends Error {
    status: number;
    response: any;
    message: string;
    constructor(error: { status: number, response: any, message: string }) {
        super();
        this.status = error.status;
        this.response = error.response;
        this.message = error.message;
    }
}

export interface APIResponse<T> {
    status: number;
    response: T;
    message: string;
}

export type APIActions = Record<string, <T>(body?: any) => Promise<APIResponse<T>>>;