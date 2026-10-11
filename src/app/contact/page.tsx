import style from "./contact.module.css";

export default function Contact() {
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.headerSection}>
          <h1 className={style.title}>Contact Us</h1>
          <p className={style.subtitle}>Questions, feedback, or want to volunteer? We would love to hear from you.</p>
          <hr className={style.divider} />
        </div>

        <form id="contact-form" className={style.form}>
          <div className={style.fieldGroup}>
            <label htmlFor="name" className={style.label}>
              NAME
            </label>
            <input className={style.textInput} type="text" id="name" name="name" required />
          </div>

          <div className={style.fieldGroup}>
            <label htmlFor="email" className={style.label}>
              EMAIL
            </label>
            <input className={style.textInput} type="email" id="email" name="email" required />
          </div>

          <div className={style.fieldGroup}>
            <label htmlFor="message" className={style.label}>
              MESSAGE
            </label>
            <textarea className={style.textareaInput} id="message" name="message" rows={5} required></textarea>
          </div>

          <div className={style.buttonWrapper}>
            <button type="submit" className={style.submitButton}>
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
