/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { LinkBadges, RoleStats, TitleBlock } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { cn, projectSlug } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";

interface Props {
  index: number;
  total: number;
  title: string;
  dates: string;
  description: string;
  icon?: string;
  screenshots: readonly string[];
  role?: string;
  stats?: string;
  technologies: readonly string[];
  features: readonly { name: string; description: string }[];
  links: readonly { icon: React.ReactNode; type: string; href: string }[];
}

// Three phones: the middle one in front, the side ones tilted behind it.
function Phones({ shots, title }: { shots: readonly string[]; title: string }) {
  return (
    <div className="group relative flex h-[440px] sm:h-[520px] items-center justify-center">
      <div className="absolute inset-x-8 inset-y-12 rounded-[3rem] bg-muted blur-2xl opacity-80" />
      {shots.map((src, i) => (
        // BlurFade animates its own inline transform, so the tilt lives on a wrapper.
        <div
          key={src}
          className={cn(
            "absolute w-[42%] sm:w-[36%] transition-transform duration-700 ease-out",
            i === 0 && "-translate-x-[62%] rotate-[-8deg] scale-90 group-hover:-translate-x-[72%] group-hover:rotate-[-11deg]",
            i === 1 && "z-10 group-hover:-translate-y-3",
            i === 2 && "translate-x-[62%] rotate-[8deg] scale-90 group-hover:translate-x-[72%] group-hover:rotate-[11deg]"
          )}
        >
          <BlurFade inView delay={0.1 + i * 0.12} yOffset={-24}>
            <img
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              loading="lazy"
              className="w-full rounded-[1.75rem] border-4 border-foreground/90 shadow-2xl"
            />
          </BlurFade>
        </div>
      ))}
    </div>
  );
}

export function AppShowcase({
  index,
  total,
  title,
  dates,
  description,
  icon,
  screenshots,
  role,
  stats,
  technologies,
  features,
  links,
}: Props) {
  const reversed = index % 2 === 1;
  const detailHref = `/projects/${projectSlug(title)}`;

  return (
    // Breaks out of the narrow page column so each app gets the full viewport.
    <article className="relative ml-[calc(50%-50vw)] w-screen min-h-dvh flex items-center border-t border-border py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div className={cn("flex flex-col gap-6", reversed && "md:order-2")}>
          <BlurFade inView delay={0.05}>
            <span className="font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </BlurFade>
          <BlurFade inView delay={0.1} className="flex flex-col gap-4">
            <TitleBlock title={title} dates={dates} icon={icon} large />
            <RoleStats role={role} />
          </BlurFade>
          <BlurFade inView delay={0.15}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>{description}</Markdown>
            </div>
          </BlurFade>
          {features.length > 0 && (
            <ul className="flex flex-col gap-3">
              {features.slice(0, 3).map((f, i) => (
                <BlurFade key={f.name} inView delay={0.2 + i * 0.05}>
                  <li className="border-l-2 border-border pl-4">
                    <p className="text-sm font-semibold">{f.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{f.description}</p>
                  </li>
                </BlurFade>
              ))}
            </ul>
          )}
          <BlurFade inView delay={0.35} className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-1">
              {technologies.map((t) => (
                <Badge key={t} variant="outline" className="h-6 border border-border px-2 text-[11px] font-medium">
                  {t}
                </Badge>
              ))}
            </div>
            <Link
              href={detailHref}
              className="group/more inline-flex h-12 w-full sm:w-fit items-center justify-center gap-2 rounded-xl bg-foreground px-7 text-base font-semibold text-background transition-opacity hover:opacity-90"
            >
              {features.length > 3 ? `See all ${features.length} features` : "See details"}
              <ArrowRight className="size-5 transition-transform group-hover/more:translate-x-1" />
            </Link>
          </BlurFade>
        </div>
        <div className={cn("flex flex-col items-center gap-5", reversed && "md:order-1")}>
          <Link href={detailHref} aria-label={`${title} details`} className="w-full">
            <Phones shots={screenshots} title={title} />
          </Link>
          {/* Proof under the screens: store numbers and where to get the app. */}
          <BlurFade inView delay={0.45} className="flex flex-col items-center gap-3">
            {stats && <p className="text-sm font-medium text-muted-foreground">{stats}</p>}
            {links.length > 0 && <LinkBadges links={links} className="justify-center" />}
          </BlurFade>
        </div>
      </div>
    </article>
  );
}
