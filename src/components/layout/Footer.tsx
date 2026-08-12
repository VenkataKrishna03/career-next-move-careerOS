import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

const product = [
  "Career Intelligence",
  "Skill Analysis",
  "Job Matching",
  "Interview Intelligence",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Your AI-powered career intelligence system.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
            Product
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {product.map((item) => (
              <li key={item}>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
            Company
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/about" className="text-foreground hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-foreground hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
            Legal
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <span className="text-muted-foreground">Privacy</span>
            </li>
            <li>
              <span className="text-muted-foreground">Terms</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page py-6">
          <p className="text-xs text-muted-foreground">
            © 2026 CareerOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
