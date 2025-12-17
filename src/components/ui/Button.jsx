import { forwardRef } from "react";
import { cn } from "./utils";

const Button = forwardRef(function Button(
  { className, variant = "primary", type = "button", disabled, ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
    outline:
      "border border-slate-600 text-slate-100 hover:bg-slate-800 focus:ring-slate-500",
    ghost: "text-slate-100 hover:bg-slate-800 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
});

export default Button;
