import { request, Result } from "./request";

export const getLog = () => request('/log')

export const getChatList = (params = {}) => request<Result>('/chat', 'GET', params)

export const getRoomListApi = (params = {}) => request<Result>('/room', 'GET', params)

export const applyRoomListApi = (data = {}) => request<Result>('/room', 'POST', data)

export const updateRoomListApi = (data = {}) => request<Result>('/room', 'PUT', data)

export const deleteRoomListApi = (id: number) => request<Result>(`/room/${id}`, 'DELETE')

export const getCourseListApi = (params = {}) => request<Result>('/course', 'GET', params)

export const updateCourseListApi = (params = {}) => request<Result>('/course', 'POST', params)

