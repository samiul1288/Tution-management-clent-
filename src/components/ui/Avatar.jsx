import { useState } from "react";
import { cn } from "./utils";

const Avatar = ({ src, alt = "avatar", size = 40, className }) => {
  const [failed, setFailed] = useState(false);
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    alt || "User"
  )}&background=0f172a&color=fff`;

  const url = !src || failed ? fallback : src;

  return (
    <img
      src={url}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={cn("rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
