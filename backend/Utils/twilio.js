import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log("TWILIO ACCOUNT SID:", accountSid);
console.log(
  "TWILIO AUTH TOKEN EXISTS:",
  Boolean(authToken)
);

if (!accountSid || !authToken) {
  throw new Error(
    "Twilio credentials are missing from backend/.env"
  );
}

const twilioClient = twilio(accountSid, authToken);

export default twilioClient;