export const getOtpEmailTemplate = ({ otp }: { otp: string }) => {
  return `
  <!DOCTYPE html>
<html lang="en" xml:lang="en">
  <head>
  <title>Message</title>
    <style>
      /* Your CSS styles here */
      body {
        font-family: 'Poppins', sans-serif;
        background: url('https://storage.googleapis.com/abe_cloud_storage/image/large/cd7c495c-0ce7-4300-b107-5c3ea743693c.png')
          no-repeat center center/cover;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 700px;
        margin: 30px auto;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid lightgray;
      }
      .title-container {
        padding: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #1e1c1f;
      }
      .main-container {
        padding: 16px;
      }
      .title-text {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      .main-text {
        font-size: 18px;
        font-weight: 400;
        margin-bottom: 16px;
      }

      .footer {
        margin-top: 70px;
      }
      .copy-text {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 10px;
        color: gray;
      }
      .mb-4 {
        margin-bottom: 16px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="title-container">
        <img
          src="https://storage.googleapis.com/lift-peak/content%2Flogo-short.png"
          alt="lift peak"
          width="300"
          height="28"
        />
      </div>
      <div class="main-container">
        <div class="title-text">Hi there!</div>
        <div class="title-text mb-4">
          Hello from LiftPeak
        </div>
        <div class="main-text">
          We received your change password request for your account.<br />
          Your OTP for the LiftPeak account is: <strong>${otp}</strong>.<br />
          It is valid for 10 minutes.
        </div>
        <div class="main-text">
          Let us know via info@liftpeak.com if you have any problems
        </div>
        <div class="main-text">Have a nice day!</div>
        <div class="footer">
          <img
            class="mb-4"
            src="https://storage.googleapis.com/lift-peak/content%2Flogo.png"
            alt="ABM"
            width="100"
            height="100"
          />
          <div class="copy-text">
            &copy; 2024 LiftPeak. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
    `;
};
