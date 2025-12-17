import { cn } from "./utils";

const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-lg",
      className
    )}
    {...props}
  />
);

export default Card;
