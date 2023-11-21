import { AxiosRequestConfig } from 'axios'
import { callExternalApi } from './external-api.service'
import { ApiResponse } from '../models/api-response'

const apiServerUrl = import.meta.env.VITE_APP_API_SERVER_URL

export const fetchPlaceList = async () => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/place/`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  }
  const { data, error } = (await callExternalApi({ config })) as ApiResponse
  return {
    data,
    error,
  }
}

export const fetchPlaceDetail = async (placeId: string) => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/place/${placeId}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  }
  const { data, error } = (await callExternalApi({ config })) as ApiResponse
  return {
    data,
    error,
  }
}

export const fetchStamps = async (
  accessToken: string,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/stamp`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const { data, error } = (await callExternalApi({ config })) as ApiResponse

  return {
    data,
    error,
  }
}
