import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// Consultation form POST route
app.post("/api/consultation", async (req, res) => {
  try {
    const data = req.body;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Consultation Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Property Consultation Request",
      html: `
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Budget:</b> ${data.budget}</p>
        <p><b>Purpose:</b> ${data.purpose}</p>
        <p><b>Timeline:</b> ${data.timeline}</p>
        <p><b>Experience:</b> ${data.experience}</p>
        <p><b>Decision Maker:</b> ${data.decisionMaker}</p>
        <p><b>Requirements:</b> ${data.requirements}</p>
      `,
    });

    res.json({ success: true, message: "Email sent successfully ✅" });
  } catch (err) {
    console.error("Full backend error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
