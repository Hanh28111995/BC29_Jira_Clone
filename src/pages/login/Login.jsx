import React, { useEffect, useRef, useState } from "react";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getToken } from "firebase/app-check";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, appCheck } from "../../configs/firebase";
import { loginPhoneApi, verifyFirebaseOtpSigninApi, loginMailApi, verifyMailOtpApi, loginPW } from "../../services/auth.service";
import OTPInputCustom from "../../components/OtpInput/OtpInput";
import { setCredentialsAction } from "../../store/actions/user.action";
import "../../components/OtpInput/index.scss";
import "./index.scss";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.data?.message || error?.message || fallback;

const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `+84${digits.slice(1)}`;
  if (digits.startsWith("84")) return `+${digits}`;
  if (digits.startsWith("+")) return value.trim();
  return value.trim();
};

const extractCredential = (result) => {
  const ro = result?.resultObject || result?.data?.resultObject || null;
  const co = result?.content || result?.data?.content || null;
  if (!ro && !co) return null;
  const base = ro || co;
  const accessToken = base.accessToken || base.token || base.loginToken || null;
  const userInfo = base.userInfo || base.user || base || null;
  return { accessToken, userInfo };
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState(params.get("mode") === "otp" ? "otp" : "password");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState("input");
  const [authType, setAuthType] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationResult = useRef(null);
  const recaptchaVerifier = useRef(null);
  const recaptchaContainerRef = useRef(null);

  useEffect(() => () => recaptchaVerifier.current?.clear(), []);

  const persistLogin = (accessToken, userInfo) => {
    dispatch(setCredentialsAction({ accessToken, userInfo }));
    notification.success({ description: "Đăng nhập thành công" });
    setTimeout(() => navigate("/project-management/board"), 0);
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setParams(nextMode === "otp" ? { mode: "otp" } : {});
    setOtpStep("input");
    setOtp("");
    setAuthType("");
  };

  const handlepasswordSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await loginPW(credentials);
      if (!result?.isSuccess) {
        notification.warning({ description: result?.message || "Email hoặc mật khẩu không chính xác" });
        return;
      }
      const credential = extractCredential(result);
      if (!credential?.accessToken) {
        notification.warning({ description: "Phản hồi server không hợp lệ (thiếu accessToken)" });
        return;
      }
      persistLogin(credential.accessToken, credential.userInfo);
    } catch (error) {
      notification.warning({ description: getErrorMessage(error, "Đăng nhập thất bại") });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (event) => {
    event.preventDefault();
    const raw = identifier.trim();
    const type = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)
      ? "email"
      : /^(?:\+?\d{1,4})?[\d\s-]{9,15}$/.test(raw) ? "phone" : null;
    
    if (!type) {
      notification.warning({ description: "Email hoặc số điện thoại không hợp lệ" });
      return;
    }

    setLoading(true);
    try {
      let response;
      if (type === "email") {
        response = await loginMailApi({ email: raw });
        const email = response?.resultObject?.email || response?.content?.email || raw;
        setAuthType("email");
        setIdentifier(email);
        setOtpStep("verify");
      } else {
        // 1. Giữ nguyên số thô để Backend xác minh trong DB
        const rawPhone = raw; 
        
        // 2. Chuẩn hóa về định dạng quốc tế (+84...) để Firebase chịu gửi SMS
        const normalizedPhone = normalizePhone(raw);
        if (!normalizedPhone || !normalizedPhone.startsWith("+")) {
          notification.warning({ description: "Số điện thoại không đúng định dạng hợp lệ" });
          setLoading(false);
          return;
        }

        const extra = {};
        if (appCheck) {
          try { extra.appCheckToken = (await getToken(appCheck, false)).token; } catch { /* noop */ }
        }

        // Gọi Backend kiểm tra sđt thô
        response = await loginPhoneApi({ phoneNumber: rawPhone, ...extra });
        if (!response?.isSuccess) {
          notification.warning({ description: response?.message || "Không thể gửi mã OTP" });
          return;
        }

        // Khởi tạo reCAPTCHA nếu chưa có
        if (!recaptchaVerifier.current && recaptchaContainerRef.current) {
          recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            size: "invisible",
            siteKey: process.env.REACT_APP_RECAPTCHA_KEY,
          });
        }

        // Yêu cầu Firebase gửi OTP dùng số đã chuẩn hóa (+84)
        confirmationResult.current = await signInWithPhoneNumber(
          auth,
          normalizedPhone,
          recaptchaVerifier.current
        );

        setAuthType("phone");
        setIdentifier(normalizedPhone); // Cập nhật lại state hiển thị dạng +84 cho đẹp
        setOtpStep("verify");
      }
    } catch (error) {
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = null;
      notification.warning({ description: getErrorMessage(error, "Không thể gửi mã OTP") });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      let verifyResult;
      if (authType === "phone") {
        const idToken = await confirmationResult.current
          .confirm(otp)
          .then((result) => result.user.getIdToken(true));
        verifyResult = await verifyFirebaseOtpSigninApi({ idToken });
      } else {
        verifyResult = await verifyMailOtpApi({ email: identifier, otp });
      }
      if (!verifyResult?.isSuccess) {
        notification.warning({ description: verifyResult?.message || "Mã OTP không chính xác hoặc đã hết hạn" });
        return;
      }
      const credential = extractCredential(verifyResult);
      if (!credential?.accessToken) {
        notification.warning({ description: "Mã OTP chính xác nhưng server chưa cấp accessToken" });
        return;
      }
      persistLogin(credential.accessToken, credential.userInfo);
    } catch (error) {
      notification.warning({ description: getErrorMessage(error, "Mã OTP không chính xác hoặc đã hết hạn") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-sm bg-light navbar-light">
          <a className="navbar-brand" href="/login">
            <img
              src="https://wac-cdn.atlassian.com/dam/jcr:e348b562-4152-4cdc-8a55-3d297e509cc8/Jira%20Software-blue.svg?cdnVersion=535"
              alt="Jira"
              style={{ height: "28px" }}
            />
          </a>
          <button className="btn btn-signup" type="button" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </nav>
      </header>
      <section className="loginPage">
        <div className="row col-12 container-fluid">
          <div className="col-12 col-sm-6 login-component-1">
            <div className="p-content w-75">
              <h2>The #1 software development tool used by agile teams</h2>
              <p>EACH PRODUCT ON A FREE PLAN:</p>
              <ul>
                <li>Supports up to 10 users</li>
                <li>Includes 2 GB storage</li>
                <li>Offers Community support</li>
                <li>Is always free, no credit card needed</li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-6 login-component-2">
            <div className="form-content mx-auto">
              <div className="auth-switch">
                <button
                  type="button"
                  className={mode === "password" ? "active" : ""}
                  onClick={() => changeMode("password")}
                >
                  Mật khẩu
                </button>
                <button
                  type="button"
                  className={mode === "otp" ? "active" : ""}
                  onClick={() => changeMode("otp")}
                >
                  OTP
                </button>
              </div>

              {mode === "password" && (
                <form className="w-75 mx-auto my-5" onSubmit={handlepasswordSubmit}>
                  <h2 className="text-center mb-3">Welcome</h2>
                  <label>Work email</label>
                  <input
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    type="email"
                    className="form-control"
                    required
                  />
                  <label>password</label>
                  <input
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    type="password"
                    className="form-control"
                    required
                  />
                  <button
                    className="my-3 btn btn-primary w-100"
                    type="submit"
                    disabled={loading}
                  >
                    LOGIN
                  </button>
                </form>
              )}

              {mode === "otp" && otpStep === "input" && (
                <form className="w-75 mx-auto my-5" onSubmit={handleSendCode}>
                  <h2 className="text-center mb-3">OTP sign in</h2>
                  <label>Email or phone</label>
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="phone/email"
                    required
                  />
                  <button
                    className="my-3 btn btn-primary w-100"
                    type="submit"
                    disabled={loading}
                  >
                    SEND OTP
                  </button>
                </form>
              )}

              {mode === "otp" && otpStep === "verify" && (
                <div className="w-75 mx-auto my-5 text-center">
                  <p>
                    Mã OTP đã gửi tới <strong>{identifier}</strong>
                  </p>
                  <OTPInputCustom value={otp} onChange={setOtp} />
                  <button
                    className="my-3 btn btn-primary w-100"
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || loading}
                  >
                    VERIFY OTP
                  </button>
                  <button
                    className="btn btn-link"
                    type="button"
                    onClick={() => setOtpStep("input")}
                  >
                    Đổi thông tin
                  </button>
                </div>
              )}

              <div ref={recaptchaContainerRef} id="recaptcha-container" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
