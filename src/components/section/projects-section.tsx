import { AppShowcase } from "@/components/app-showcase";
import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

// Shipped apps (the ones with store screenshots) get a full-screen section each;
// tools and products without screenshots stay in a compact grid after them.
const apps = DATA.projects.filter((p) => p.screenshots.length > 0);
const others = DATA.projects.filter((p) => p.screenshots.length === 0);

function Divider({ label }: { label: string }) {
    return (
        <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
                <span className="text-background text-sm font-medium">{label}</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
        </div>
    );
}

export default function ProjectsSection() {
    return (
        <div className="flex min-h-0 flex-col gap-y-8">
            <div className="flex flex-col gap-y-4 items-center justify-center">
                <Divider label="My Projects" />
                <div className="flex flex-col gap-y-3 items-center justify-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Apps I&apos;ve shipped</h2>
                    <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
                        {apps.length} apps live on the App Store and Google Play. Scroll through
                        them one by one, or open any app to see everything I built in it.
                    </p>
                </div>
            </div>

            <div>
                {apps.map((project, i) => (
                    <AppShowcase
                        key={project.title}
                        index={i}
                        total={apps.length}
                        title={project.title}
                        dates={project.dates}
                        description={project.description}
                        icon={project.icon}
                        screenshots={project.screenshots}
                        role={project.role}
                        stats={project.stats}
                        technologies={project.technologies}
                        features={project.features}
                        links={project.links}
                    />
                ))}
            </div>

            {others.length > 0 && (
                <div className="flex flex-col gap-y-8 pt-8">
                    <div className="flex flex-col gap-y-3 items-center">
                        <Divider label="Tools & Products" />
                        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Open source and my own products</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto auto-rows-fr">
                        {others.map((project, id) => (
                            <BlurFade key={project.title} inView delay={BLUR_FADE_DELAY + id * 0.05} className="h-full">
                                <ProjectCard
                                    href={project.href}
                                    title={project.title}
                                    description={project.description}
                                    dates={project.dates}
                                    tags={project.technologies}
                                    icon={project.icon}
                                    screenshots={project.screenshots}
                                    cover={"cover" in project ? project.cover : undefined}
                                    role={project.role}
                                    stats={project.stats}
                                    features={project.features}
                                    links={project.links}
                                />
                            </BlurFade>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
