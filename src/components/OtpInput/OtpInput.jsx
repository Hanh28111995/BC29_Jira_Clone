import React, { useRef } from "react";

export default function OTPInputCustom({ length = 6, value, onChange }) {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    onChange(event.target.value.replace(/\D/g, "").slice(0, length));
  };

  return (
    <div
      className="custom-otp-wrapper"
      onClick={() => inputRef.current?.focus()}
      role="group"
      aria-label="Mã OTP"
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={handleChange}
        maxLength={length}
        className="custom-otp-input"
        aria-label="Nhập mã OTP"
      />
      {Array.from({ length }, (_, index) => (
        <span key={index} className={value[index] ? "has-value" : ""}>
          {value[index] || ""}
        </span>
      ))}
    </div>
  );
}
