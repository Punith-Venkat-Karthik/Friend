const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* serve html files */
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const fromNumber = "whatsapp:+14155238886";
const toNumber = "whatsapp:+916281354121";

app.post("/send-message", async (req, res) => {

  const message = req.body.message;

  try {

    const msg = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber
    });

    console.log("Message sent:", msg.sid);
    res.json({ success: true });

  } catch (error) {

    console.log(error);
    res.status(500).send("Error sending message");

  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});