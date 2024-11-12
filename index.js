const express = require("express");
const app = express();

const { google } = require("googleapis");

require("dotenv").config();

const APP_ENDPOINT = `${process.env.PROTOCOL}://${process.env.HOST}${
  ![80, 443].includes(process.env.PORT) ? ":" + process.env.PORT : ""
}`;

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUR_CLIENT_ID,
  process.env.YOUR_CLIENT_SECRET,
  `${APP_ENDPOINT}/auth/google/callback`
);
const scopes = [
  // "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const loginURL = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "offline",
  // If you only need one scope, you can pass it as a string
  scope: scopes,
});

app.get("/", (req, res) => {
  console.debug("loginURL", loginURL);
  res.redirect(loginURL);
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    console.debug("tokens", tokens);
    oauth2Client.setCredentials(tokens);
  } catch (error) {
    console.error(error)
  }

  res.sendStatus(200);
});

app.listen(process.env.PORT, () => {
  console.log(`Ready at ${APP_ENDPOINT}`);
});


// 4. Lấy thông tin người dùng
async function getUserInfo(access_token) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await response.json();
  return data;
}
