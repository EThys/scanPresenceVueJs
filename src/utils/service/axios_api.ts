import axios, { type AxiosInstance } from 'axios'


export const useAxiosRequestWithToken = (token: string = ''): AxiosInstance => {
  const useAxios: AxiosInstance = axios.create({
    baseURL: 'http://213.136.74.84:703/api/',
    headers: {
      accept: 'application/json',
      'Content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${token}`
    }
  })

  return useAxios
}

export const useAxiosRequestWithTokenForCsv = (token: string = ''): AxiosInstance => {
  const useAxios: AxiosInstance = axios.create({
    baseURL: 'http://213.136.74.84:703/api/',
    headers: {
      accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${token}`
    }
  })

  return useAxios
}
