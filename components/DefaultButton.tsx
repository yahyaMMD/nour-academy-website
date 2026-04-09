import Link from "next/link";
import React from "react";

interface DefaultButtonProps {
  text: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverBackground?: string;
  hoverText?: string;
}

const DefaultButton = ({ 
  text, 
  url,
  backgroundColor = "transparent",
  textColor = "var(--brand-ink)",
  borderColor = "var(--brand-primary)",
  hoverBackground = "var(--brand-primary)",
  hoverText = "#FAFAFA"
}: DefaultButtonProps) => {
  return (
    <Link href={url} passHref>
      <button
        style={{
          fontFamily: "var(--font-brand-body)",
          fontWeight: 600,
          fontSize: "1rem",
          border: `1px solid ${borderColor}`,
          padding: "0.75rem 1.5rem",
          transition: "0.3s all ease",
          borderRadius: "5px",
          backgroundColor: backgroundColor,
          color: textColor,
          cursor: "pointer",
          minWidth: "150px",
          textAlign: "center" as const,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = hoverBackground;
          e.currentTarget.style.color = hoverText || textColor;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = backgroundColor;
          e.currentTarget.style.color = textColor;
        }}
      >
        {text}
      </button>
    </Link>
  );
};

export { DefaultButton };
