const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require('dotenv').config(); // To load environment variables from a .env file


const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the static HTML file
app.use(express.static("FrontEnd"));

// CORS code:
app.use(cors({
  origin: "https://furquan-portfolio-site.onrender.com", // Allow frontend domain
  methods: "POST",
  allowedHeaders: ["Content-Type"]
}));

// Route to handle form submission
app.post("/send-email", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Set up email data
  let mailOptions = {
    from: email, // sender address
    to: process.env.RECEIVER_EMAIL, // list of receivers
    subject: subject, // Subject line
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // plain text body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).send(error.toString());
    }
    console.log("Message sent: " + info.response); // Log the success response
    res.status(200).send("Message sent successfully");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
