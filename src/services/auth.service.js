import { request } from "../configs/axios";

const unwrap = (response) => response?.data || response;

const loginPhoneApi = (data) =>
  request({
    url: "/signin/create-phone-code",
    method: "POST",
    data,
  }).then(unwrap);

const loginMailApi = (data) =>
  request({
    url: "/signin/create-email-code",
    method: "POST",
    data,
  }).then(unwrap);

const verifyPhoneOtpApi = (data) =>
  request({
    url: "/signin/owner/validate-phone-code",
    method: "POST",
    data,
  }).then(unwrap);

const verifyMailOtpApi = (data) =>
  request({
    url: "/signin/employee/validate-email-code",
    method: "POST",
    data,
  }).then(unwrap);

export { loginPhoneApi, verifyPhoneOtpApi, loginMailApi, verifyMailOtpApi };
