import React, { useEffect, useRef, useState } from "react";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getToken } from "firebase/app-check";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, appCheck } from "../../configs/firebase";
import { loginPhoneApi, verifyPhoneOtpApi, loginMailApi, verifyMailOtpApi, loginPW } from "../../services/auth.service";
import OTPInputCustom from "../../components/OtpInput/OtpInput";
import { USER_KEY } from "../../constants/common";
import { setUserInfoAction } from "../../store/actions/user.action";
import "../../components/OtpInput/index.scss";
import "./index.scss";

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState(params.get("mode") === "otp" ? "otp" : "password");
  const [credentials, setCredentials] = useState({ email: "", passWord: "" });
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState("input");
  const [authType, setAuthType] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationResult = useRef(null);
  const recaptchaVerifier = useRef(null);
  const recaptchaContainerRef = useRef(null);

  useEffect(() => () => recaptchaVerifier.current?.clear(), []);

  const saveUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    dispatch(setUserInfoAction(user));
    navigate("/project-management/board");
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setParams(nextMode === "otp" ? { mode: "otp" } : {});
    setOtpStep("input");
    setOtp("");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await loginPW(credentials);
      saveUser(result.content);
      notification.success({ description: "Log in success" });
    } catch (error) {
      notification.warning({ description: getErrorMessage(error, "Đăng nhập thất bại") });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (event) => {
    event.preventDefault();
    const value = identifier.trim();
    const type = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? "email"
      : /^(?:\+?\d{1,4})?[\d\s-]{9,15}$/.test(value) ? "phone" : null;
    if (!type) {
      notification.warning({ description: "Email hoặc số điện thoại không hợp lệ" });
      return;
    }
    setLoading(true);
    try {
      const response = type === "email"
        ? await loginMailApi({ email: value })
        : await loginPhoneApi({ phoneNumber: value, ...(appCheck ? { appCheckToken: (await getToken(appCheck, false)).token } : {}) });
      const displayValue = response?.content?.email || response?.content?.phoneNumber || value;
      if (type === "phone") {
        recaptchaVerifier.current ||= new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: "invisible",
          siteKey: process.env.REACT_APP_RECAPTCHA_KEY,
        });
        confirmationResult.current = await signInWithPhoneNumber(auth, displayValue, recaptchaVerifier.current);
      }
      setAuthType(type);
      setIdentifier(displayValue);
      setOtpStep("verify");
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
      const response = authType === "phone"
        ? await confirmationResult.current.confirm(otp).then((result) => result.user.getIdToken()).then((idToken) => verifyPhoneOtpApi({ idToken }))
        : await verifyMailOtpApi({ email: identifier, otp });
      saveUser(response.content);
    } catch (error) {
      notification.warning({ description: getErrorMessage(error, "Mã OTP không chính xác hoặc đã hết hạn") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header><nav className="navbar navbar-expand-sm bg-light navbar-light"><a className="navbar-brand" href="/login"><img src="https://wac-cdn.atlassian.com/dam/jcr:e348b562-4152-4cdc-8a55-3d297e509cc8/Jira%20Software-blue.svg?cdnVersion=535" alt="Jira" style={{ height: "28px" }} /></a><button className="btn btn-signup" type="button" onClick={() => navigate("/register")}>Sign Up</button></nav></header>
      <section className="loginPage"><div className="row col-12 container-fluid"><div className="col-12 col-sm-6 login-component-1"><div className="p-content w-75"><h2>The #1 software development tool used by agile teams</h2><p>EACH PRODUCT ON A FREE PLAN:</p><ul><li>Supports up to 10 users</li><li>Includes 2 GB storage</li><li>Offers Community support</li><li>Is always free, no credit card needed</li></ul></div></div><div className="col-12 col-sm-6 login-component-2"><div className="form-content mx-auto"><div className="auth-switch"><button type="button" className={mode === "password" ? "active" : ""} onClick={() => changeMode("password")}>Mật khẩu</button><button type="button" className={mode === "otp" ? "active" : ""} onClick={() => changeMode("otp")}>OTP</button></div>
        {mode === "password" && <form className="w-75 mx-auto my-5" onSubmit={handlePasswordSubmit}><h2 className="text-center mb-3">Welcome</h2><label>Work email</label><input value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} type="email" className="form-control" required /><label>Password</label><input value={credentials.passWord} onChange={(e) => setCredentials({ ...credentials, passWord: e.target.value })} type="password" className="form-control" required /><button className="my-3 btn btn-primary w-100" type="submit" disabled={loading}>LOGIN</button></form>}
        {mode === "otp" && otpStep === "input" && <form className="w-75 mx-auto my-5" onSubmit={handleSendCode}><h2 className="text-center mb-3">OTP sign in</h2><label>Email or phone</label><input value={identifier} onChange={(e) => setIdentifier(e.target.value)} type="text" className="form-control" placeholder="phone/email" required /><button className="my-3 btn btn-primary w-100" type="submit" disabled={loading}>SEND OTP</button></form>}
        {mode === "otp" && otpStep === "verify" && <div className="w-75 mx-auto my-5 text-center"><p>Mã OTP đã gửi tới <strong>{identifier}</strong></p><OTPInputCustom value={otp} onChange={setOtp} /><button className="my-3 btn btn-primary w-100" type="button" onClick={handleVerifyOtp} disabled={otp.length !== 6 || loading}>VERIFY OTP</button><button className="btn btn-link" type="button" onClick={() => setOtpStep("input")}>Đổi thông tin</button></div>}
        <div ref={recaptchaContainerRef} id="recaptcha-container" /></div></div></div></section>
    </>
  );
}
