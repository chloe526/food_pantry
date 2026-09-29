import style from "./Card.module.css";
import Link from "next/link";

interface HomeCardProps {
  title: string;
  description: string;
  link: string;
}

export default function Card({ title, description, link }: HomeCardProps) {
  return (
    <div className={style.card}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link href={link}>{title} →</Link>
    </div>
  );
}
