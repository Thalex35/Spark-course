import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brand } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({
    mode: z.enum(["signin", "signup"]).optional(),
    redirect: z.string().optional(),
  }),
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Serenity Studio" },
      {
        name: "description",
        content: "Sign in to continue your courses or create a free Serenity Studio account.",
      },
      { property: "og:title", content: "Sign in — Serenity Studio" },
      { property: "og:description", content: "Access your enrolled courses and track your progress." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode = "signin", redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn, user } = useApp();
  const [loading, setLoading] = useState(false);

  // Already signed in? Go where they were heading.
  useEffect(() => {
    if (user) navigate({ to: redirect ?? "/dashboard", replace: true });
  }, [user, redirect, navigate]);

  function submit(e: React.FormEvent<HTMLFormElement>, isSignup: boolean) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const name = String(form.get("name") ?? "");
    if (isSignup && String(form.get("password")) !== String(form.get("confirm"))) {
      toast.error("Those passwords don't match");
      return;
    }
    setLoading(true);
    // Simulated API latency for the demo flow.
    setTimeout(() => {
      signIn(email, name);
      setLoading(false);
      toast.success(isSignup ? "Account created — welcome!" : "Welcome back!");
      navigate({ to: redirect ?? "/dashboard" });
    }, 700);
  }

  return (
    <div className="section-x flex justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="font-display text-center text-3xl font-semibold">Welcome to {brand.name}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          This is a demo sign-in — any email and password will work.
        </p>

        <Tabs
          value={mode}
          onValueChange={(v) => navigate({ to: "/auth", search: { mode: v as "signin" | "signup", redirect } })}
          className="mt-8"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={(e) => submit(e, false)} className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
              <div>
                <Label htmlFor="si-email">Email</Label>
                <Input id="si-email" name="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="si-password">Password</Label>
                <Input id="si-password" name="password" type="password" required minLength={4} className="mt-1.5" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox name="remember" defaultChecked /> Remember me
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-accent"
                  onClick={() => toast("Password reset emails are mocked in this template.")}
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />} Sign in
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={(e) => submit(e, true)} className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
              <div>
                <Label htmlFor="su-name">Full name</Label>
                <Input id="su-name" name="name" required placeholder="Alex Rivera" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" name="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="su-password">Password</Label>
                <Input id="su-password" name="password" type="password" required minLength={4} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="su-confirm">Confirm password</Label>
                <Input id="su-confirm" name="confirm" type="password" required minLength={4} className="mt-1.5" />
              </div>
              <label className="flex items-start gap-2 text-sm">
                <Checkbox name="terms" required className="mt-0.5" />
                <span className="text-muted-foreground">
                  I agree to the terms of service and privacy policy.
                </span>
              </label>
              <Button type="submit" className="w-full rounded-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />} Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["Google", "Facebook"].map((provider) => (
            <Button
              key={provider}
              variant="outline"
              className="rounded-full"
              onClick={() => toast(`${provider} sign-in is mocked in this template.`)}
            >
              Continue with {provider}
            </Button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Just browsing?{" "}
          <Link to="/courses" className="text-primary hover:text-accent">
            Explore the courses
          </Link>
        </p>
      </div>
    </div>
  );
}
