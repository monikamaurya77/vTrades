// src/components/OTPInput.js
import React, { useRef, useEffect } from 'react';

const OTPInput = ({ otp, setOtp, length = 6 }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = otp.split('');
      newOtp[index] = value;
      setOtp(newOtp.join(''));

      // Move to next input if a digit is entered
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pasteData)) {
      setOtp(pasteData);
      // Focus the last input after pasting
      inputRefs.current[Math.min(pasteData.length - 1, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 mb-4">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={otp[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined} // Only handle paste on first input
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center text-2xl bg-inputBg border border-inputBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      ))}
    </div>
  );
};

export default OTPInput;