"use client";

import { useState } from "react";

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-20 w-20 text-2xl",
};

export default function UserAvatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image?: string | null;
  size?: keyof typeof SIZE_CLASSES;
}) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const sizeClass = SIZE_CLASSES[size];

  if (image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied URL, next/image can't optimize it
      <img
        src={image}
        alt={`รูปโปรไฟล์ของ ${name}`}
        onError={() => setFailed(true)}
        className={`${sizeClass} shrink-0 rounded-full border border-gold/20 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-gold-wash font-serif font-semibold text-gold-deep`}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
