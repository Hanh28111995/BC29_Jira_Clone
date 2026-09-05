import { request } from "../configs/axios";

const body = (response) => response?.data || response;

/* ============================================================
 * NHÓM 1: ĐĂNG NHẬP TRUYỀN THỐNG (EMAIL / PASSWORD)
 * Trả về: { isSuccess, message, resultObject: { accessToken, userInfo } }
 * ============================================================ */

const loginPW = (data) =>
  request({
    url: "/api/Auth/signin",
    method: "POST",
    data,
  }).then(body);

/* ============================================================
 * NHÓM 2: ĐĂNG NHẬP FIREBASE PHONE OTP (2 BƯỚC)
 *   Bước 1: signin-firebase → gửi phoneNumber → backend kiểm tra tồn tại user + kích hoạt Firebase
 *           Phía Frontend sau đó dùng Firebase Client SDK để trigger gửi SMS OTP
 *   Bước 2: signin-firebase-verify → gửi { idToken } (Firebase JWT do Client SDK cấp sau khi user nhập đúng OTP)
 *           → backend cấp JWT server (accessToken + userInfo)
 * ============================================================ */

const loginPhoneApi = (data) =>
  request({
    url: "/api/Auth/signin-firebase",
    method: "POST",
    data,
  }).then(body);

const verifyFirebaseOtpSigninApi = (data) =>
  request({
    url: "/api/Auth/signin-firebase-verify",
    method: "POST",
    data,
  }).then(body);

const verifyPhoneOtpApi = (data) =>
  request({
    url: "/api/Auth/validate-phone-code",
    method: "POST",
    data,
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
  verifyFirebaseOtpSigninApi,
  verifyPhoneOtpApi,
  loginMailApi,
  verifyMailOtpApi,
};
