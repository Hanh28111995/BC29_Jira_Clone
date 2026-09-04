import { request } from "../configs/axios";

const unwrap = (response) => response?.data || response;

const loginPhoneApi = (data) =>
  request({
    url: "/api/Auth/signin-firebase",
    method: "POST",
    data,
  }).then(unwrap);

const loginPW = (data) =>
  request({
    url: "/api/Auth/signin",
    method: "POST",
    data,
  }).then(unwrap);

const verifyPhoneOtpApi = (data) =>
  request({
    url: "/api/Auth/validate-phone-code",
    method: "POST",
    data,
  }).then(unwrap);

const loginMailApi = (data) =>
  request({
    url: "/api/Auth/send-email-code",
    method: "POST",
    data,
  }).then(unwrap);

const verifyMailOtpApi = (data) =>
  request({
    url: "/api/Auth/verify-email-code",
    method: "POST",
    data,
  }).then(unwrap);

export { loginPhoneApi, verifyPhoneOtpApi, loginMailApi, verifyMailOtpApi, loginPW };
