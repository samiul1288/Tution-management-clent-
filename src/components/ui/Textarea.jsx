import { forwardRef } from "react";
import { cn } from "./utils";

const Textarea = forwardRef(function Textarea(
  { className, label, error, value, rows = 4, ...props },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm text-slate-200">{label}</span>
      )}
      <textarea
        ref={ref}
        rows={rows}
        value={value ?? ""} // ✅ null safe
        className={cn(
          "w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-600",
          error && "border-red-600 focus:ring-red-600",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
});

export default Textarea;
