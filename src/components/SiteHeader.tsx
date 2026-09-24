import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { brand } from "@/lib/data";
import { useApp } from "@/lib/store";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { user, signOut } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/courses", search: { q: query || undefined } });
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md">
      <div className="section-x grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:flex md:justify-between">
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
              <Sparkles width={18} height={18} />
            </span>
            <span className="font-display truncate text-lg font-semibold">{brand.name}</span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-primary-soft text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-2">
          <form onSubmit={submitSearch} className="hidden md:block" role="search">
            <label className="sr-only" htmlFor="header-search">
              Search courses
            </label>
            <div className="relative">
              <Search
                width={15}
                height={15}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="header-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses"
                className="h-9 w-44 rounded-full pl-9 lg:w-56"
              />
            </div>
          </form>
          <Button asChild variant="ghost" size="icon" className="md:hidden">
            <Link to="/courses" aria-label="Search courses">
              <Search />
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full" aria-label="Your account">
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get started
                </Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display text-lg">{brand.name}</SheetTitle>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link to="/dashboard" className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted">
                      Profile
                    </Link>
                  </>
                ) : (
                  <Button asChild className="mt-4">
                    <Link to="/auth">Sign in / Sign up</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
