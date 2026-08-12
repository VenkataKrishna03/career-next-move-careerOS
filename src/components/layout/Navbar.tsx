import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BrandButton } from "@/components/ui/brand-button";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();


  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <BrandButton asChild variant="ghost" size="sm">
                <Link to="/signin">Sign In</Link>
              </BrandButton>
              <BrandButton asChild size="sm">
                <Link to="/signup">Get Started</Link>
              </BrandButton>
            </>
          )}
        </div>


        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-11 place-items-center rounded-md border border-border text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-background md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-foreground data-[status=active]:text-primary"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              {loading ? null : user ? (
                <UserMenu user={user} onNavigate={() => setOpen(false)} />
              ) : (
                <>
                  <BrandButton asChild variant="outline" size="full">
                    <Link to="/signin" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  </BrandButton>
                  <BrandButton asChild size="full">
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Get Started
                    </Link>
                  </BrandButton>
                </>
              )}
            </div>

          </nav>
        </div>
      ) : null}
    </header>
  );
}
