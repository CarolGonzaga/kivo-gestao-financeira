import { cn } from "@/lib/utils";
import LogoSvg from "@/public/logo.svg";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo Icon */}
      <div className={cn("relative", sizeClasses[size])}>
  <img
    src="/logo.svg"
    alt="Logo da aplicação"
    className="h-full w-full object-contain"
  />
</div>

      {showText && (
        <span className={cn("font-bold tracking-tight text-foreground", textSizeClasses[size])}>
          Kivo
        </span>
      )}
    </div>
  );
}
