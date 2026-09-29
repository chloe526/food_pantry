import style from "./QuickInfo.module.css";

interface QuickInfoProps {
  primary: string;
  secondary: string;
}

export default function QuickInfo({ primary, secondary }: QuickInfoProps) {
  return (
    <div className={style.card}>
      <h3>{primary}</h3>
      <p>{secondary}</p>
    </div>
  );
}
