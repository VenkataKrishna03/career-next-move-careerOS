import { Link } from "@tanstack/react-router";
import { BrandButton } from "@/components/ui/brand-button";

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions">
      <h2 id="quick-actions" className="font-heading text-lg font-bold text-foreground">
        Quick Actions
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <BrandButton asChild size="sm">
          <Link to="/dashboard/career-analysis">Analyze My Career</Link>
        </BrandButton>
        <BrandButton asChild variant="outline" size="sm">
          <Link to="/dashboard/skill-gap">Check Skill Gap</Link>
        </BrandButton>
        <BrandButton asChild variant="outline" size="sm">
          <Link to="/roadmap">Generate Roadmap</Link>
        </BrandButton>
        <BrandButton asChild variant="outline" size="sm">
          <Link to="/dashboard/resume-analyzer">Analyze Resume</Link>
        </BrandButton>
        <BrandButton asChild variant="outline" size="sm">
          <Link to="/dashboard/ai-interview">Start AI Interview</Link>
        </BrandButton>
      </div>
    </section>
  );
}
