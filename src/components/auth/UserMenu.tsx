import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAvatarUrl, getDisplayName, getInitials } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Avatar({ user, size = "size-8" }: { user: User; size?: string }) {
  const url = getAvatarUrl(user);
  const name = getDisplayName(user);
  return url ? (
    <img
      src={url}
      alt={name}
      className={`${size} rounded-full border border-border object-cover`}
      referrerPolicy="no-referrer"
    />
  ) : (
    <span
      aria-hidden="true"
      className={`${size} grid place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground`}
    >
      {getInitials(name)}
    </span>
  );
}

export function UserMenu({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const name = getDisplayName(user);

  async function handleSignOut() {
    setOpen(false);
    await supabase.auth.signOut();
    onNavigate?.();
    navigate({ to: "/", replace: true });
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
        >
          <Avatar user={user} />
          <span className="max-w-[10rem] truncate">{name}</span>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 px-2 py-2.5">
          <Avatar user={user} size="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" onClick={() => { setOpen(false); onNavigate?.(); }}>
            <UserIcon className="size-4" aria-hidden="true" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); void handleSignOut(); }}>
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Avatar as UserAvatar };
