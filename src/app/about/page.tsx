import styles from "./about-styles.module.css";
import Image from "next/image";
import Link from "next/link";
import foodPantryImage from "./foodPantry.png";

export default function AboutPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>About</h1>
        <div className={styles.gridContainer}>
          <div className={styles.aboutContainer}>
            <div className={styles.imageWrapper}>
              <hr className={styles.titleDivider} />
              <Image
                src={foodPantryImage}
                alt="Cal Poly Food Pantry"
                width={600}
                height={350}
                className={styles.pantryImg}
              />
            </div>

            <p className={styles.paragraph}>
              The Cal Poly Food Pantry is a student-run resource open to all currently enrolled students. We believe
              food insecurity should never stand in the way of academic success. All items are available free of charge,
              no proof of need required.
            </p>

            <p className={styles.paragraph}>
              Our pantry is stocked through donations from the campus community, local businesses, and food banks. We
              partner with the ASI Food Pantry and local organizations to maintain a consistent supply of nutritious
              food throughout the year.
            </p>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoDiv}>
              <h3 className={styles.logi_header}>Hours</h3>
              <p className={styles.logi_info}>
                <strong>Monday-Friday:</strong> 8:30am–6:00pm
                <br />
                <strong>Saturday-Sunday:</strong> Closed
              </p>
              <p className={styles.disclaimer}>Closed on University Holidays</p>
            </div>

            <div className={styles.infoDiv}>
              <h3 className={styles.logi_header}>Location</h3>
              <p className={styles.logi_info}>
                Campus Health and Wellbeing
                <br />
                Building 27, Room 208
                <br />
                Cal Poly, San Luis Obispo, CA 93407
              </p>
            </div>
          </div>
        </div>
        <p className={`${styles.paragraph} ${styles.fullWidthParagraph}`}>
          The majority of the food in the Cal Poly Food Pantry comes from the SLO Food Bank, where the Cal Poly Food
          Pantry is a regulated, agency partner. Local produce is supplied weekly from the Cal Poly Crops unit. The Food
          Pantry also participates in a food rescue program with Sprouts, Grocery Outlet, and Food 4 Less Grocery Stores
          in San Luis Obispo. Lastly, community members are welcome to donate to the Food Pantry and as a result, there
          is a robust inventory of food and personal hygiene items.
        </p>
      </div>
    </div>
  );
}
