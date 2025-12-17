import { forwardRef } from "react";
import { cn } from "./utils";

const Input = forwardRef(function Input(
  { className, label, error, value, ...props },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm text-slate-200">{label}</span>
      )}
      <input
        ref={ref}
        value={value ?? ""} // ✅ null safe
        className={cn(
          "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-600",
          error && "border-red-600 focus:ring-red-600",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
});

export default Input;
