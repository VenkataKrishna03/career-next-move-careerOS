import { Link } from "@tanstack/react-router";
import { BrandButton } from "@/components/ui/brand-button";

type CTASectionProps = {
  heading: string;
  subheading: string;
  buttonLabel: string;
  to?: "/signup" | "/signin" | "/contact";
};

export function CTASection({
  heading,
  subheading,
  buttonLabel,
  to = "/signup",
}: CTASectionProps) {
  return (
    <section className="border-t border-border bg-background py-20 sm:py-24">
      <div className="container-page text-center">
        <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-bold text-foreground sm:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          {subheading}
        </p>
        <div className="mt-8">
          <BrandButton asChild size="lg">
            <Link to={to}>{buttonLabel}</Link>
          </BrandButton>
        </div>
      </div>
    </section>
  );
}
