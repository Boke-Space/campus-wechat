import { request, Result } from "./request";

export const getApplyListApi = (params = {}) => request<Result>('/apply', 'GET', params)

export const applyLeaveApi = (data: any) => request('/apply', 'POST', data)

export const getApplyOneApi = (data: any) => request('/apply/one', 'GET', data)

export const getApplyTwoApi = (data: any) => request('/apply/two', 'GET', data)

// 健康上报
export const healthReportApi = (data: any) => request<Result>('/report', 'POST', data)

// 获取上报数据
export const getReportListApi = (params?: any) => request<Result>('/report', 'GET', params)

// 修改上报数据
export const modifyReportApi = (data: any) => request<Result>('/report', 'PUT', data)

// 发布文章
export const postArticleApi = (data: any) => request<Result>('/article', 'POST', data)

// 查询文章
export const getArticleApi = (params = {}) => request<Result>('/article', 'GET', params)

// 修改文章
export const modifyArticleApi = (data = {}) => request<Result>('/article', 'PUT', data)

// 删除文章
export const deleteArticleApi = (id: number) => request<Result>(`/article/${id}`, 'DELETE')

// 发布文章
export const postInformApi = (data: any) => request<Result>('/inform', 'POST', data)

// 查询文章
export const getInformApi = (params = {}) => request<Result>('/inform', 'GET', params)

// 修改文章
export const modifyInformApi = (data = {}) => request<Result>('/inform', 'PUT', data)

// 删除文章
export const deleteInformApi = (id: number) => request<Result>(`/inform/${id}`, 'DELETE')

