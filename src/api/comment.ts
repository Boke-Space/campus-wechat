import { request, Result } from "./request";

export const getNotice = (params = {}) => request<Result>('/notice', 'GET', params)

export const modifyNotice = (data: any) => request<Result>('/notice', 'PUT', data)

export const deleteNotice = (id: number) => request<Result>(`/notice/${id}`, 'DELETE')

export const postNotice = (data: any) => request<Result>(`/notice`, 'POST', data)

export const getCommentList = (id: any) => request<Result>(`/comment/${id}`, 'GET')

export const sendComment = (data: any) => request<Result>(`/comment`, 'POST', data)

export const getLikeList = (params = {}) => request<Result>('/like', 'GET', params)

export const modifyLike = (data: any) => request<Result>('/like', 'PUT', data)

export const appendLike = (data: any) => request<Result>('/like', 'POST', data)

export const postMessageApi = (data: any) => request<Result>('/message', 'POST', data)

export const modifyMessageApi = (data: any) => request<Result>('/message', 'PUT', data)

export const getMessageApi = (params = {}) => request<Result>('/message', 'GET', params)




