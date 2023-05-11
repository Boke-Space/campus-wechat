import { request } from "./request";
import  type { Result } from "./request";

export const loginApi = (data: any): any => request<Result>('/login', 'POST', data)

export const changeUser = (data: any): any => request<Result>('/user', 'PUT', data)

export const findUser = (params = {}): any => request<Result>('/student', 'GET', params)

export const uploadFile = (File: any) => request<Result>('/upload', 'POST', File)

export const searchUser = (params = {}): any => request<Result>('/search', 'GET', params)

export const openIdApi = (params = {}) => request<Result>('/express/openId', 'GET', params)

export const subscribeExpress = (data = {}): any => request<Result>('/express/subscribe', 'POST', data)

