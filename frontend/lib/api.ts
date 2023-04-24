/*
 * Class that handles all API calls
 */

import { UploadResponse } from "./types";

export const API_URL = 'http://127.0.0.1:8000';
export default class API {
    static async upload(body: FormData): Promise<APIResponse<UploadResponse>> {
        return await this.post('upload', body);
    }
    static async download(id: string): Promise<APIResponse<Blob>> {
        let res = await this.rawPost('download', JSON.stringify({ file_id: id }));
        if (res.ok) {
            const responseObject: APIResponse<Blob> = {
                status: res.status,
                response: await res.blob(),
                message: '',
            };
            return responseObject;
        }
        if (res.headers.get('Content-Type').includes('application/json')) {
            const json = await res.json();
            throw new APIError({
                status: res.status,
                response: json,
                message: json.message != null ? json.message : 'Unknown error',
            });
        }
        throw new APIError({
            status: res.status,
            response: await res.json(),
            message: 'Unknown error',
        });
    }
    static async rawGet(path: string): Promise<Response> {
        const response = await fetch(`${API_URL}/${path}`);
        return response;
    }

    static async rawPost(path: string, body: any): Promise<Response> {
        const response = await fetch(`${API_URL}/${path}`, {
            method: 'POST',
            body,
        });
        return response;
    }

    static async get<T>(path: string): Promise<APIResponse<T>> {
        const response = await this.rawGet(path);
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

    static async post<T>(path: string, body: any): Promise<APIResponse<T>> {
        const response = await this.rawPost(path, body);
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