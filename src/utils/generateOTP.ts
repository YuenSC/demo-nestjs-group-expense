/**
 * This is a simple function to generate a 6 digit OTP
 * OTP is only used for verifying the user's email address. It is not used at every login.
 * So it can be done simply by storing the otp inside the user's document in the database.
 * @returns {string} - 6 digit OTP
 */

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};
