import styles from "./about-styles.module.css";
import Image from "next/image";
import foodPantryImage from "./foodPantry.png";

export default function Page() {
  return (
    <div className={styles.outerContainer}>
      <h1 className={styles.title}>About</h1>
      <div className={styles.innerContainer}>
        <div className={styles.aboutContainer}>
          <Image
            src={foodPantryImage}
            alt="Cal Poly Food Pantry"
            height={300}
            style={{ width: "100%", height: "auto" }}
          ></Image>
          <p>
            The Cal Poly Food Pantry is a student-run resource open to all currently enrolled students. We believe food
            insecurity should never stand in the way of academic success. All items are available free of charge, no
            proof of need required.
          </p>
          <p>
            Our pantry is stocked through donations from the campus community, local businesses, and food banks. We
            partner with the ASI Food Pantry and local organizations to maintain a consistent supply of nutritious food
            throughout the year.
          </p>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoDiv}>
            <h3 className={styles.logi_header}>Hours</h3>
            <p className={styles.logi_info}>
              Monday-Friday: 8:30 AM - 6:00 pm
              <br />
              Saturday-Sunday: Closed
            </p>
            <p className={styles.disclaimer}>Closed on university holidays</p>
          </div>
          <div className={styles.infoDiv}>
            <h3 className={styles.logi_header}>Location</h3>
            <p className={styles.logi_info}>
              Cal Poly Health and Wellbeing Center <br />
              Building 27, Room 208 <br />
              Cal Poly, San Luis Obispo, CA 93407
            </p>
          </div>
        </div>
      </div>
      <div>Div3</div>
    </div>
  );
  // return (
  //   <div className={styles.outer}>
  //     <h1 className={styles.title}>About</h1>
  //     <div className={styles.about}>
  //       <Image src={foodPantryImage} alt="Cal Poly Food Pantry" height={200}></Image>
  //       <p className={styles.pantry_about}>
  //         The Cal Poly Food Pantry is a student-run resource open to all currently enrolled students. We believe food
  //         insecurity should never satand in the way of academic success. All items are available free of charge, no
  //         proof of need required.
  //         <br /> <br />
  //         Our pantry is stocked through donations from the campus community, local businesses, and food banks. We
  //         partner with the ASI Food Pantry and local organizations to maintain a consisten supply of nutritious food
  //         throughout the year.
  //       </p>
  //       <div className={styles.side_div}>
  //         <div>
  //           <h3 className={styles.logi_header}>Hours</h3>
  //           <p className={styles.logi_info}>
  //             Monday-Friday: 8:30 AM - 6:00 pm
  //             <br />
  //             Saturday-Sunday: Closed
  //           </p>
  //           <p className={styles.disclaimer}>Closed on university holidays</p>
  //         </div>
  //         <div>
  //           <h3 className={styles.logi_header}>Location</h3>
  //           <p className={styles.logi_info}>
  //             Building 27, Room 208 <br />
  //             Cal Poly, San Luis Obispo, CA 93407
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
