import mock from "mockjs";

const data = {
  "success": true,
  "name": '',
  "password": '',
  "token": 'asbdnakdschdfabdn123123'
}
mock.mock('/rrms/api/login', 'post', data);
export default mock;