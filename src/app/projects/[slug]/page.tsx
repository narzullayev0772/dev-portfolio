/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { LinkBadges, RoleStats, TitleBlock } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { projectSlug } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

type Params = { params: Promise<{ slug: string }> };

const findProject = (slug: string) => DATA.projects.find((p) => projectSlug(p.title) === slug);

export function generateStaticParams() {
  return DATA.projects.map((p) => ({ slug: projectSlug(p.title) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = findProject((await params).slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectPage({ params }: Params) {
  const project = findProject((await params).slug);
  if (!project) notFound();

  return (
    <main className="flex flex-col gap-10">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> All projects
        </Link>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2} className="flex flex-col gap-4">
        <TitleBlock title={project.title} dates={project.dates} icon={project.icon} large />
        <RoleStats role={project.role} stats={project.stats} />
        {project.links.length > 0 && <LinkBadges links={project.links} />}
      </BlurFade>

      {project.screenshots.length > 0 && (
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1 snap-x">
            {project.screenshots.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                className="h-96 w-auto flex-none snap-start rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        </BlurFade>
      )}

      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{project.description}</Markdown>
        </div>
      </BlurFade>

      {project.features.length > 0 && (
        <section className="flex flex-col gap-5">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">What I built</h2>
          </BlurFade>
          <ul className="flex flex-col gap-6">
            {project.features.map((f, i) => (
              <BlurFade key={f.name} delay={BLUR_FADE_DELAY * 6 + i * 0.03}>
                <li className="flex flex-col gap-2 border-l-2 border-border pl-4">
                  <h3 className="font-semibold">{f.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {f.tech.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[11px] h-5 px-1.5 font-medium">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </li>
              </BlurFade>
            ))}
          </ul>
        </section>
      )}

      <BlurFade delay={BLUR_FADE_DELAY * 8} className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Built with</h2>
        <div className="flex flex-wrap gap-1">
          {project.technologies.map((tag) => (
            <Badge key={tag} className="text-[11px] font-medium border border-border h-6 w-fit px-2" variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </BlurFade>
    </main>
  );
}
