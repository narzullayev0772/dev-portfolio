/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";

interface Feature {
  name: string;
  description: string;
  tech: readonly string[];
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
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

// Three store screenshots as phone screens; they fan out a little on hover.
function Screens({ shots, title }: { shots: readonly string[]; title: string }) {
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
  role,
  stats,
  features,
  links,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "group flex flex-col border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-muted transition-all duration-200",
        className
      )}
    >
      {screenshots && screenshots.length > 0 && (
        <div className="relative shrink-0">
          <Screens shots={screenshots} title={title} />
          {links && links.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-wrap gap-2 z-20">
              {links.map((link, idx) => (
                <Link href={link.href} key={idx} target="_blank" rel="noopener noreferrer">
                  <Badge
                    className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90"
                    variant="default"
                  >
                    {link.icon}
                    {link.type}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <img
                src={icon}
                alt={`${title} app icon`}
                className="size-11 rounded-[10px] border border-border shadow-sm flex-none"
              />
            )}
            <div className="flex flex-col gap-1 min-w-0">
              <h3 className="font-semibold leading-none">{title}</h3>
              <time className="text-xs text-muted-foreground">{dates}</time>
            </div>
          </div>
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
        {(role || stats) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {role && <span className="font-medium text-foreground">{role}</span>}
            {stats && <span className="text-muted-foreground">{stats}</span>}
          </div>
        )}
        <div className="text-xs prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
        {(!screenshots || screenshots.length === 0) && links && links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((link, idx) => (
              <Link href={link.href} key={idx} target="_blank" rel="noopener noreferrer">
                <Badge className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        {features && features.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="features" className="border-b-0 border-t border-border">
              <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline cursor-pointer [&>svg]:hidden group/trigger">
                <span>
                  {features.length} features I built
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]/trigger:rotate-180" />
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <ul className="flex flex-col gap-4">
                  {features.map((f) => (
                    <li key={f.name} className="flex flex-col gap-1.5 border-l-2 border-border pl-3">
                      <span className="text-xs font-semibold text-foreground">{f.name}</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {f.tech.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] h-5 px-1.5 font-medium">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="text-[11px] font-medium border border-border h-6 w-fit px-2"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
