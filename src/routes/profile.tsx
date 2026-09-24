import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Bell, Heart, KeyRound, Pencil, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCourse } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Serenity Studio" },
      {
        name: "description",
        content: "Manage your profile, course history, wishlist, certificates and account settings.",
      },
      { property: "og:title", content: "Your Profile — Serenity Studio" },
      { property: "og:description", content: "Update your details and download your certificates." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser, enrollments, wishlist, progress, ready, signOut } = useApp();
  const [editing, setEditing] = useState(false);

  if (!ready) return <div className="section-x py-24 text-muted-foreground">Loading your profile…</div>;

  if (!user) {
    return (
      <div className="section-x py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Sign in to view your profile</h1>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    );
  }

  const enrolled = enrollments.map((e) => getCourse(e.courseId)!).filter(Boolean);
  const completed = enrolled.filter((c) => progress(c.id) === 100);
  const inProgress = enrolled.filter((c) => progress(c.id) < 100);
  const saved = wishlist.map((id) => getCourse(id)!).filter(Boolean);

  return (
    <div className="section-x py-12">
      <h1 className="font-display text-4xl font-semibold">Your account</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <section className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <UserRound width={26} height={26} />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold">{user.name}</h2>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setEditing((v) => !v)}>
                <Pencil /> {editing ? "Cancel" : "Edit profile"}
              </Button>
            </div>

            {editing ? (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  updateUser({
                    name: String(f.get("name") ?? ""),
                    email: String(f.get("email") ?? ""),
                    phone: String(f.get("phone") ?? ""),
                    bio: String(f.get("bio") ?? ""),
                  });
                  setEditing(false);
                  toast.success("Profile updated");
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="pf-name">Name</Label>
                    <Input id="pf-name" name="name" defaultValue={user.name} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="pf-email">Email</Label>
                    <Input id="pf-email" name="email" type="email" defaultValue={user.email} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="pf-phone">Phone</Label>
                    <Input id="pf-phone" name="phone" defaultValue={user.phone} className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pf-bio">About me</Label>
                  <Textarea id="pf-bio" name="bio" defaultValue={user.bio} className="mt-1.5" />
                </div>
                <Button type="submit" className="rounded-full">
                  Save changes
                </Button>
              </form>
            ) : (
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Phone</dt>
                  <dd>{user.phone || "Not added yet"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">About me</dt>
                  <dd className="text-muted-foreground">
                    {user.bio || "Add a short bio so your coach knows what you're working on."}
                  </dd>
                </div>
              </dl>
            )}
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Course history</h2>

            <h3 className="mt-5 text-sm font-semibold text-muted-foreground">In progress</h3>
            {inProgress.length ? (
              <ul className="mt-3 space-y-3">
                {inProgress.map((c) => (
                  <li key={c.id} className="rounded-xl border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        to="/learn/$courseId"
                        params={{ courseId: c.id }}
                        className="text-sm font-medium hover:text-primary"
                      >
                        {c.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">{progress(c.id)}%</span>
                    </div>
                    <Progress value={progress(c.id)} className="mt-2" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Nothing in progress right now.</p>
            )}

            <h3 className="mt-6 text-sm font-semibold text-muted-foreground">Completed</h3>
            {completed.length ? (
              <ul className="mt-3 space-y-3">
                {completed.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
                    <span className="text-sm font-medium">{c.title}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => toast.success("Certificate download started (demo)")}
                    >
                      <Award /> Certificate
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Finish every lesson in a course to unlock its certificate.
              </p>
            )}

            <h3 className="mt-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Heart width={14} height={14} /> Wishlist
            </h3>
            {saved.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {saved.map((c) => (
                  <li key={c.id}>
                    <Link to="/courses/$courseId" params={{ courseId: c.id }}>
                      <Badge variant="secondary" className="cursor-pointer">
                        {c.title}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No saved courses yet.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <KeyRound width={18} height={18} className="text-primary" /> Change password
            </h2>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Password updated (demo)");
                e.currentTarget.reset();
              }}
            >
              <div>
                <Label htmlFor="pw-current">Current password</Label>
                <Input id="pw-current" type="password" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="pw-new">New password</Label>
                <Input id="pw-new" type="password" required minLength={4} className="mt-1.5" />
              </div>
              <Button type="submit" variant="outline" className="w-full rounded-full">
                Update password
              </Button>
            </form>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Bell width={18} height={18} className="text-primary" /> Notifications
            </h2>
            <ul className="mt-4 space-y-4 text-sm">
              {[
                ["New lesson alerts", true],
                ["Weekly progress email", true],
                ["Offers and new courses", false],
              ].map(([label, def]) => (
                <li key={String(label)} className="flex items-center justify-between gap-4">
                  <span>{label}</span>
                  <Switch
                    defaultChecked={def as boolean}
                    aria-label={String(label)}
                    onCheckedChange={() => toast.success("Preference saved")}
                  />
                </li>
              ))}
            </ul>
          </section>

          <Button variant="outline" className="w-full rounded-full" onClick={() => signOut()}>
            Sign out
          </Button>
        </aside>
      </div>
    </div>
  );
}
