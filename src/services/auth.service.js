import { request } from "../configs/axios";

const body = (response) => response?.data || response;

const loginPW = (data) =>
  request({
    url: "/api/Auth/signin",
    method: "POST",
    data,
  }).then(body);

const loginPhoneApi = (phone) =>
  request({
    url: "/api/Auth/check-phone",
    method: "POST",
    params: { phone }, 
  }).then(body);

const verifyPhoneOtpApi = (data) =>
  request({
    url: "/api/Auth/validate-phone-code",
    method: "POST",
    data,
  }).then(body);

  const logoutApi = () =>
  request({
    url: "/api/Auth/revoke",
    method: "POST",
  }).then(body);

/* ============================================================
 * NHÓM 3: XÁC THỰC BẰNG EMAIL OTP (LEGACY)
 * ============================================================ */

const loginMailApi = (data) =>
  request({
    url: "/api/Auth/send-email-code",
    method: "POST",
    data,
  }).then(body);

const verifyMailOtpApi = (data) =>
  request({
    url: "/api/Auth/verify-email-code",
    method: "POST",
    data,
  }).then(body);

export {
  loginPW,
  loginPhoneApi,  
  verifyPhoneOtpApi,
  loginMailApi,
  verifyMailOtpApi,
  logoutApi
};
