// import axios from "axios";
import { axios } from '@/utils/request'
export function getAction(url, params) {
  return axios({
    url: url,
    method: 'get',
    params: params
  })
}
export function postAction(url, params) {
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
export function putAction(url, params) {
  return axios({
    url: url,
    method: 'put',
    data: params
  })
}
export function patchAction(url, params) {
  return axios({
    url: url,
    method: 'patch',
    data: params
  })
}
export function deleteAction(url, params) {
  return axios({
    url: url,
    method: 'delete',
    data: params
  })
}
export function downloadAction(url, params) {
  return axios({
    url: url,
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}