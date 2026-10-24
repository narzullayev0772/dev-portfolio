/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import Markdown from "react-markdown";

interface Feature {
  name: string;
  description: string;
  tech: readonly string[];
}

interface ProjectLink {
  icon: React.ReactNode;
  type: string;
  href: string;
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  icon?: string;
  screenshots?: readonly string[];
  role?: string;
  stats?: string;
  features?: readonly Feature[];
  links?: readonly ProjectLink[];
  className?: string;
}

function LinkBadges({ links, className }: { links: readonly ProjectLink[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {links.map((link, idx) => (
        <Link href={link.href} key={idx} target="_blank" rel="noopener noreferrer">
          <Badge className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90" variant="default">
            {link.icon}
            {link.type}
          </Badge>
        </Link>
      ))}
    </div>
  );
}

// Three store screenshots as phone screens; they fan out a little on hover.
// Projects without screenshots get the same-height tile so every card lines up.
function Media({ shots, icon, title }: { shots?: readonly string[]; icon?: string; title: string }) {
  if (!shots || shots.length === 0) {
    return (
      <div className="h-56 bg-muted flex items-center justify-center">
        {icon ? (
          <img src={icon} alt="" className="size-20 rounded-2xl shadow-lg" />
        ) : (
          <span className="px-6 text-center text-3xl font-semibold tracking-tighter text-muted-foreground/60 text-balance">{title}</span>
        )}
      </div>
    );
  }
  return (
    <div className="relative h-56 bg-muted overflow-hidden flex items-end justify-center gap-3 pt-6">
      {shots.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${title} screenshot ${i + 1}`}
          loading="lazy"
          className={cn(
            "w-[28%] rounded-t-xl border border-b-0 border-border shadow-lg object-cover object-top transition-transform duration-500 ease-out",
            i === 0 && "translate-y-6 -rotate-3 group-hover:-translate-x-2 group-hover:-rotate-6",
            i === 1 && "translate-y-2 z-10 group-hover:-translate-y-1",
            i === 2 && "translate-y-6 rotate-3 group-hover:translate-x-2 group-hover:rotate-6"
          )}
        />
      ))}
    </div>
  );
}

function TitleBlock({ title, dates, icon }: { title: string; dates: string; icon?: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      {icon && (
        <img src={icon} alt={`${title} app icon`} className="size-11 rounded-[10px] border border-border shadow-sm flex-none" />
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-semibold leading-none">{title}</h3>
        <time className="text-xs text-muted-foreground">{dates}</time>
      </div>
    </div>
  );
}

function RoleStats({ role, stats }: { role?: string; stats?: string }) {
  if (!role && !stats) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
      {role && <span className="font-medium text-foreground">{role}</span>}
      {stats && <span className="text-muted-foreground">{stats}</span>}
    </div>
  );
}

// Full project details. A centered dialog on desktop, a bottom drawer on phones.
function DetailsDialog({
  dialogRef,
  title,
  dates,
  icon,
  role,
  stats,
  description,
  screenshots,
  features,
  tags,
  links,
}: Omit<Props, "href" | "className"> & { dialogRef: React.RefObject<HTMLDialogElement | null> }) {
  const close = () => dialogRef.current?.close();
  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => e.target === e.currentTarget && close()}
      className={cn(
        "m-0 mt-auto w-full max-w-full max-h-[90dvh] rounded-t-2xl sm:m-auto sm:max-w-2xl sm:max-h-[85dvh] sm:rounded-2xl",
        "border border-border bg-background text-foreground p-0 shadow-2xl overscroll-contain",
        "backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        "transition-all duration-300 ease-out transition-discrete",
        "starting:open:translate-y-8 starting:open:opacity-0 sm:starting:open:translate-y-0 sm:starting:open:scale-95"
      )}
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-background/95 backdrop-blur p-5">
        <div className="flex flex-col gap-2 min-w-0">
          <TitleBlock title={title} dates={dates} icon={icon} />
          <RoleStats role={role} stats={stats} />
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-6 p-5">
        {links && links.length > 0 && <LinkBadges links={links} />}

        {screenshots && screenshots.length > 0 && (
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 snap-x">
            {screenshots.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${title} screenshot ${i + 1}`}
                className="h-80 w-auto flex-none snap-start rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        )}

        <div className="text-sm prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>

        {features && features.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">What I built</h4>
            <ul className="flex flex-col gap-4">
              {features.map((f) => (
                <li key={f.name} className="flex flex-col gap-1.5 border-l-2 border-border pl-3">
                  <span className="text-sm font-semibold text-foreground">{f.name}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {f.tech.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[11px] h-5 px-1.5 font-medium">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Built with</h4>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} className="text-[11px] font-medium border border-border h-6 w-fit px-2" variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  icon,
  screenshots,
  role,
  stats,
  features,
  links,
  className,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hasShots = !!screenshots && screenshots.length > 0;

  return (
    <div
      className={cn(
        "group flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-muted transition-all duration-200",
        className
      )}
    >
      <div className="relative shrink-0">
        <Media shots={screenshots} icon={hasShots ? undefined : icon} title={title} />
        {links && links.length > 0 && <LinkBadges links={links} className="absolute top-2 right-2 z-20" />}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <TitleBlock title={title} dates={dates} icon={icon} />
          {href && (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              aria-label={`Open ${title}`}
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
        <RoleStats role={role} stats={stats} />
        <div className="text-xs prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert line-clamp-3">
          <Markdown>{description}</Markdown>
        </div>
        <div className="mt-auto flex flex-col gap-3">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} className="text-[11px] font-medium border border-border h-6 w-fit px-2" variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="w-full rounded-lg border border-border py-2 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            More{features && features.length > 0 ? ` · ${features.length} features` : ""}
          </button>
        </div>
      </div>
      <DetailsDialog
        dialogRef={dialogRef}
        title={title}
        dates={dates}
        icon={icon}
        role={role}
        stats={stats}
        description={description}
        screenshots={screenshots}
        features={features}
        tags={tags}
        links={links}
      />
    </div>
  );
}
