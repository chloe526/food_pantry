import Card from "@/components/Card";
import QuickInfo from "@/components/QuickInfo";
import Link from "next/link";
import style from "./Home.module.css";

export default function Home() {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className={style.mainCard}>
          <h1>No Mustang Goes Hungry</h1>
          <p>The Cal Poly Food Pantry provides free groceries to all enrolled students — no documentation required.</p>
          <div className={style.quickInfo}>
            <QuickInfo primary="2,400+" secondary="Students served" />
            <QuickInfo primary="12,000 lbs" secondary="Food distributed" />
            <QuickInfo primary="Free" secondary="Always, no proof needed" />
            <QuickInfo primary="Mon - Fri" secondary="10am - 4pm" />
          </div>
        </div>
        <div className={style.cards}>
          <Card title="Menu" description="See what is currently in stock." link="/menu" />
          <Card title="Wishlist" description="Tell us what you need most." link="/wishlist" />
          <Card title="Contact" description="Questions or feedback? Reach out!" link="/contact" />
        </div>
        <hr style={{ border: "none", borderTop: "2px solid green", margin: " 20px 0" }} />
      </div>
    </div>
  );
}
