"use client";

import { useState } from "react";
import formStyles from "@/components/Form.module.css";
import styles from "./contact.module.css";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // No backend for Contact yet. When there is one, send the data here.
    e.currentTarget.reset(); // clears the fields
    setSent(true);
  };

  return (
    <main className={styles.page}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>Questions, feedback, or want to volunteer? We would love to hear from you.</p>
        <hr className={styles.divider} />
      </div>
      <form id="contact-form" className={formStyles.form} onSubmit={handleSubmit}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label htmlFor="name" className={formStyles.label}>
              NAME
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              required
              className={formStyles.input}
              onChange={() => setSent(false)}
            />
          </div>

          <div className={formStyles.field}>
            <label htmlFor="email" className={formStyles.label}>
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              className={formStyles.input}
              onChange={() => setSent(false)}
            />
          </div>
        </div>

        <div className={formStyles.field}>
          <label htmlFor="message" className={formStyles.label}>
            MESSAGE
          </label>
          <textarea id="message" name="message" required className={formStyles.input} onChange={() => setSent(false)} />
        </div>

        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </div>

        {/* aria-live announces the message to screen readers */}
        <div aria-live="polite" className={formStyles.statusRegion}>
          {sent && <p className={`${formStyles.status} ${formStyles.success}`}>Thanks! We got your message.</p>}
        </div>
      </form>
    </main>
  );
}
