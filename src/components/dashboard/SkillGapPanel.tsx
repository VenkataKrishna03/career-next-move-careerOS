import type { SkillGapData } from "@/lib/dashboard-data";

type Tone = "have" | "missing" | "recommended";

const toneClass: Record<Tone, string> = {
  have: "border-primary/50 bg-primary/15 text-primary",
  missing: "border-border bg-transparent text-foreground",
  recommended: "border-foreground/30 bg-foreground/10 text-foreground",
};

function TagGroup({ title, items, tone }: { title: string; items: string[]; tone: Tone }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClass[tone]}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillGapPanel({ skills }: { skills: SkillGapData }) {
  return (
    <section aria-labelledby="skill-gap" className="rounded-xl border border-border p-6">
      <h2 id="skill-gap" className="font-heading text-lg font-bold text-foreground">
        Skill Gap
      </h2>
      <div className="mt-4 space-y-5">
        <TagGroup title="Skills I have" items={skills.have} tone="have" />
        <TagGroup title="Skills missing" items={skills.missing} tone="missing" />
        <TagGroup title="Recommended to learn" items={skills.recommended} tone="recommended" />
      </div>
    </section>
  );
}
