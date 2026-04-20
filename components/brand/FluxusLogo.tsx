import Image from "next/image";
import { cn } from "@/lib/utils";

type FluxusLogoProps = {
  variant?: "mark" | "wordmark";
  tone?: "auto" | "dark" | "light" | "blue";
  className?: string;
  imageClassName?: string;
};

export function FluxusLogo({
  variant = "wordmark",
  tone = "auto",
  className,
  imageClassName,
}: FluxusLogoProps) {
  if (tone === "auto") {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <Image
          src={logoSrc(variant, "light")}
          alt="Fluxus Hub"
          width={180}
          height={48}
          className={cn("block light:hidden", imageClassName)}
          priority
        />
        <Image
          src={logoSrc(variant, "dark")}
          alt="Fluxus Hub"
          width={180}
          height={48}
          className={cn("hidden light:block", imageClassName)}
          priority
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={logoSrc(variant, tone)}
        alt="Fluxus Hub"
        width={180}
        height={48}
        className={cn("block", imageClassName)}
        priority
      />
    </span>
  );
}

function logoSrc(
  variant: NonNullable<FluxusLogoProps["variant"]>,
  tone: Exclude<NonNullable<FluxusLogoProps["tone"]>, "auto">
) {
  if (variant === "mark") {
    if (tone === "light") {
      return "/fluxus-hub-logo-white.svg";
    }

    if (tone === "dark") {
      return "/fluxus-hub-logo-black.svg";
    }

    return "/fluxus-hub-logo-blue.svg";
  }

  if (tone === "light") {
    return "/fluxus-hub-logo-text-white.svg";
  }

  if (tone === "dark") {
    return "/fluxus-hub-logo-blue-text-black.svg";
  }

  return "/fluxus-hub-logo-blue-text-black.svg";
}
