/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { cn, projectSlug } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
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
  cover?: string;
  role?: string;
  stats?: string;
  features?: readonly Feature[];
  links?: readonly ProjectLink[];
  className?: string;
}

export function LinkBadges({ links, className }: { links: readonly ProjectLink[]; className?: string }) {
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

export function TitleBlock({ title, dates, icon, large }: { title: string; dates: string; icon?: string; large?: boolean }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      {icon && (
        <img
          src={icon}
          alt={`${title} app icon`}
          className={cn("rounded-[10px] border border-border shadow-sm flex-none", large ? "size-16 rounded-2xl" : "size-11")}
        />
      )}
      <div className="flex flex-col gap-1 min-w-0">
        {large ? (
          <h1 className="text-3xl font-semibold tracking-tighter leading-none">{title}</h1>
        ) : (
          <h3 className="font-semibold leading-none">{title}</h3>
        )}
        <time className="text-xs text-muted-foreground">{dates}</time>
      </div>
    </div>
  );
}

export function RoleStats({ role, stats }: { role?: string; stats?: string }) {
  if (!role && !stats) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
      {role && <span className="font-medium text-foreground">{role}</span>}
      {stats && <span className="text-muted-foreground">{stats}</span>}
    </div>
  );
}

// Three store screenshots as phone screens; they fan out a little on hover.
// Projects without screenshots get the same-height tile so every card lines up.
function Media({ shots, icon, cover, title }: { shots?: readonly string[]; icon?: string; cover?: string; title: string }) {
  if (cover) {
    return <img src={cover} alt={`${title} cover`} className="h-56 w-full object-cover bg-white" />;
  }
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

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  icon,
  screenshots,
  cover,
  role,
  stats,
  features,
  links,
  className,
}: Props) {
  const detailHref = `/projects/${projectSlug(title)}`;
  const hasShots = !!screenshots && screenshots.length > 0;

  return (
    <div
      className={cn(
        "group flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-muted transition-all duration-200",
        className
      )}
    >
      <div className="relative shrink-0">
        <Link href={detailHref} aria-label={`${title} details`} className="block">
          <Media shots={screenshots} icon={hasShots ? undefined : icon} cover={cover} title={title} />
        </Link>
        {links && links.length > 0 && <LinkBadges links={links} className="absolute top-2 right-2 z-20" />}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={detailHref} className="min-w-0 hover:opacity-80 transition-opacity">
            <TitleBlock title={title} dates={dates} icon={icon} />
          </Link>
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
          <Link
            href={detailHref}
            className="w-full rounded-lg border border-border py-2 text-center text-xs font-semibold hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            More{features && features.length > 0 ? ` · ${features.length} features` : ""}
          </Link>
        </div>
      </div>
    </div>
  );
}
