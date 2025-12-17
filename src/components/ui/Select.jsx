import { cn } from "./utils";

const Select = ({ className, label, error, value, children, ...props }) => {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm text-slate-200">{label}</span>
      )}
      <select
        value={value ?? ""} // ✅ null safe
        className={cn(
          "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-600",
          error && "border-red-600 focus:ring-red-600",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
};

export default Select;
