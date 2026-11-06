import { cn } from "@/lib/utils";
import Link from "next/link";

export type Store = "App Store" | "Google Play";

export const isStore = (type: string): type is Store => type === "App Store" || type === "Google Play";

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

// The four-colour Play triangle: blue left edge, green top, yellow tip, red bottom.
function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="#4285F4" d="M3.6 1.8 13.5 12 3.6 22.2c-.3-.2-.5-.6-.5-1.1V2.9c0-.5.2-.9.5-1.1z" />
      <path fill="#34A853" d="M16.8 8.7 13.5 12 3.6 1.8c.4-.3 1-.3 1.6 0z" />
      <path fill="#FBBC04" d="M20.4 10.6c.9.5.9 2.2 0 2.7l-3.6 2-3.3-3.3 3.3-3.3z" />
      <path fill="#EA4335" d="M16.8 15.3 5.2 22c-.6.3-1.2.3-1.6.2L13.5 12z" />
    </svg>
  );
}

// Black two-line badge in the style of the official store buttons.
export function StoreBadge({ store, href, className }: { store: Store; href: string; className?: string }) {
  const apple = store === "App Store";
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={apple ? "Download on the App Store" : "Get it on Google Play"}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-lg border border-white/20 bg-black pl-2.5 pr-3.5 text-white transition-transform hover:scale-[1.03] active:scale-[0.98]",
        className
      )}
    >
      {apple ? <AppleLogo className="size-6" /> : <PlayLogo className="size-6" />}
      <span className="flex flex-col leading-none">
        <span className="text-[9px] font-medium tracking-wide">{apple ? "Download on the" : "GET IT ON"}</span>
        <span className="text-[17px] font-semibold tracking-tight -mt-px">{store}</span>
      </span>
    </Link>
  );
}
