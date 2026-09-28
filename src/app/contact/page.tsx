"use client";
import "../globals.css";

export default function Contact() {
  return (
    <main>
      <h1>Contact Us</h1>
      <form id="contact-form">
        <input type="text" id="name" name="name" placeholder="Your Name" aria-label="Your Name" required />
        <input type="email" id="email" name="email" placeholder="Your Email" aria-label="Your Email" required />
        <textarea id="message" name="message" placeholder="Your Message" aria-label="Your Message" required></textarea>
        <input type="submit" value="Submit" />
      </form>
    </main>
  );
}
