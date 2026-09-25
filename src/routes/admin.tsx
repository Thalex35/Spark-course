import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  ChevronRight,
  CircleDollarSign,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { brand, courses as demoCourses } from "@/lib/data";
import { getCourses } from "@/lib/data-source";
import { isTemplateMode } from "@/lib/platform";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { useApp } from "@/lib/store";

type AdminView = "dashboard" | "analytics" | "courses" | "users" | "settings";

export const Route = createFileRoute("/admin")({
  validateSearch: z.object({
    view: z.enum(["dashboard", "analytics", "courses", "users", "settings"]).optional(),
  }),
  head: () => ({
    meta: [
      { title: "Admin workspace - Serenity Studio" },
      { name: "description", content: "Manage the Serenity Studio learning platform." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const navigation: { view: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "courses", label: "Courses", icon: BookOpen },
  { view: "users", label: "Users", icon: Users },
  { view: "settings", label: "Settings", icon: Settings },
];

function AdminPage() {
  const { view = "dashboard" } = Route.useSearch();
  const navigate = useNavigate();
  const { user, ready, signOut } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courses, setCourses] = useState(demoCourses);
  const [stats, setStats] = useState({ users: 0, enrollments: 0, revenue: 0, completion: 0 });
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!ready || !isAdmin || isTemplateMode || !isSupabaseConfigured) return;
    const client = getSupabaseClient();
    void Promise.all([
      getCourses(),
      client.from("profiles").select("id", { count: "exact", head: true }),
      client.from("enrollments").select("id", { count: "exact", head: true }),
      client.from("orders").select("amount").eq("status", "paid"),
    ]).then(([liveCourses, users, enrollments, orders]) => {
      setCourses(liveCourses);
      setStats({
        users: users.count ?? 0,
        enrollments: enrollments.count ?? 0,
        revenue: (orders.data ?? []).reduce((total, order) => total + Number(order.amount ?? 0), 0),
        completion: 68,
      });
    });
  }, [isAdmin, ready]);

  if (!ready)
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30">
        Loading admin workspace...
      </div>
    );

  if (!user || !isAdmin) {
    return (
      <div className="grid min-h-[75vh] place-items-center bg-muted/30 px-6">
        <div className="max-w-md rounded-3xl border bg-card p-8 text-center shadow-soft">
          <ShieldCheck className="mx-auto size-10 text-primary" />
          <h1 className="mt-5 font-display text-3xl font-semibold">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This workspace is restricted to accounts with the admin role. Sign in with your platform
            owner account to continue.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/">Back to site</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/auth" search={{ redirect: "/admin" }}>
                Sign in
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeLabel = navigation.find((item) => item.view === view)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b px-6">
          <Link to="/admin" search={{ view: "dashboard" }} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground">
              <Sparkles size={19} />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold">{brand.name}</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Admin workspace
              </span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin menu"
          >
            <X />
          </Button>
        </div>

        <div className="border-b px-4 py-5">
          <div className="rounded-2xl bg-primary-soft p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                <UserRound size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">Platform owner</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Admin navigation">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.view}
                to="/admin"
                search={{ view: item.view }}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${view === item.view ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon size={18} />
                {item.label}
                {view === item.view && <ChevronRight size={15} className="ml-auto" />}
              </Link>
            );
          })}
          <p className="mt-7 px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Switch layer
          </p>
          <a
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Sparkles size={18} /> Template preview <ArrowUpRight size={14} className="ml-auto" />
          </a>
          <Link
            to="/courses"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Activity size={18} /> Real app <ArrowUpRight size={14} className="ml-auto" />
          </Link>
        </nav>

        <div className="border-t p-4">
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close admin menu overlay"
        />
      )}

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu />
            </Button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Control center
              </p>
              <h1 className="font-display text-2xl font-semibold">{activeLabel}</h1>
            </div>
          </div>
          <Badge variant="outline" className="hidden gap-2 rounded-full px-3 py-1.5 sm:inline-flex">
            <span className="size-2 rounded-full bg-success" /> Production layer
          </Badge>
        </header>

        <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
          {view === "dashboard" && <DashboardView courses={courses} stats={stats} />}
          {view === "analytics" && <AnalyticsView stats={stats} />}
          {view === "courses" && <CoursesView courses={courses} />}
          {view === "users" && <UsersView />}
          {view === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

type Stats = { users: number; enrollments: number; revenue: number; completion: number };

function DashboardView({ courses, stats }: { courses: typeof demoCourses; stats: Stats }) {
  const cards = [
    { label: "Total learners", value: stats.users || "--", detail: "Active profiles", icon: Users },
    {
      label: "Enrollments",
      value: stats.enrollments || "--",
      detail: "Across all courses",
      icon: BookOpen,
    },
    {
      label: "Revenue",
      value: stats.revenue ? `$${stats.revenue.toLocaleString()}` : "$--",
      detail: "Paid orders",
      icon: CircleDollarSign,
    },
    {
      label: "Completion rate",
      value: stats.completion ? `${stats.completion}%` : "--",
      detail: "Average course progress",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-brand p-7 text-primary-foreground sm:flex-row sm:items-end sm:p-9">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-75">
            Good morning
          </p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            Your learning platform at a glance.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 opacity-80">
            Monitor the catalog, understand learner activity and keep every part of the experience
            moving.
          </p>
        </div>
        <Button
          onClick={() => toast("Course editor is the next admin workflow.")}
          className="rounded-full bg-card text-foreground hover:bg-card/90"
        >
          <FilePlus2 /> Add course
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon size={19} />
                </span>
                <span className="text-xs text-success">+12.4%</span>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Enrollment activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                New learners over the last 7 days
              </p>
            </div>
            <BarChart3 className="text-primary" />
          </div>
          <div className="mt-8 flex h-48 items-end gap-3 border-b border-l px-4 pb-0 pt-4">
            {[42, 58, 46, 76, 62, 88, 70].map((height, index) => (
              <div key={index} className="group flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-primary/75 transition-all group-hover:bg-primary"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between px-3 text-xs text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Catalog health</h2>
              <p className="mt-1 text-sm text-muted-foreground">Published learning content</p>
            </div>
            <BookOpen className="text-primary" />
          </div>
          <div className="mt-8 space-y-5">
            <Metric label="Published courses" value={courses.length} total={10} />
            <Metric
              label="Courses with lessons"
              value={courses.filter((course) => course.modules.length > 0).length}
              total={courses.length || 1}
            />
            <Metric label="Average rating" value={4.8} total={5} />
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticsView({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold">Analytics</h2>
        <p className="mt-2 text-muted-foreground">
          A clear view of audience, conversion and learning momentum.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold">Conversion funnel</h3>
          <div className="mt-7 space-y-5">
            <Metric label="Course visitors" value={12480} total={12480} />
            <Metric label="Course detail views" value={7820} total={12480} />
            <Metric label="Checkout started" value={1840} total={12480} />
            <Metric label="Completed enrollments" value={stats.enrollments || 640} total={12480} />
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold">Learner engagement</h3>
          <div className="mt-7 grid grid-cols-2 gap-4">
            <Insight label="Weekly active learners" value="1,284" change="+18%" />
            <Insight label="Lessons completed" value="8,492" change="+23%" />
            <Insight label="Avg. session" value="24m" change="+6%" />
            <Insight label="Returning learners" value="72%" change="+9%" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesView({ courses }: { courses: typeof demoCourses }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl font-semibold">Courses</h2>
          <p className="mt-2 text-muted-foreground">
            Manage the catalog that powers the real learning experience.
          </p>
        </div>
        <Button className="rounded-full" onClick={() => toast("Course creation form coming next.")}>
          <FilePlus2 /> Add course
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="grid grid-cols-[minmax(0,1fr)_100px_120px_110px] gap-4 border-b px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Course</span>
          <span>Level</span>
          <span>Students</span>
          <span>Status</span>
        </div>
        {courses.map((course) => (
          <div
            key={course.id}
            className="grid grid-cols-[minmax(0,1fr)_100px_120px_110px] items-center gap-4 border-b px-5 py-4 last:border-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img src={course.image} alt="" className="size-12 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{course.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {course.category} · ${course.price}
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{course.level}</span>
            <span className="text-sm">{course.students.toLocaleString()}</span>
            <Badge className="w-fit bg-success/10 text-success hover:bg-success/10">
              Published
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersView() {
  const [users, setUsers] = useState<{ email: string; name: string; role: string }[]>([]);
  useEffect(() => {
    if (isTemplateMode || !isSupabaseConfigured) return;
    void getSupabaseClient()
      .from("profiles")
      .select("full_name, email, role")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) =>
        setUsers(
          (data ?? []).map((item) => ({
            name: String(item.full_name),
            email: String(item.email),
            role: String(item.role),
          })),
        ),
      );
  }, []);
  const rows = users.length
    ? users
    : [{ name: "No production users yet", email: "Create an account to see it here", role: "-" }];
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold">Users</h2>
        <p className="mt-2 text-muted-foreground">Review learner profiles and platform roles.</p>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Search users" className="max-w-sm" />
          <Button
            variant="outline"
            className="rounded-full sm:ml-auto"
            onClick={() => toast("User export prepared.")}
          >
            Export CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px] gap-4 border-b px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
            </div>
            {rows.map((item) => (
              <div
                key={item.email}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px] gap-4 border-b px-3 py-4 last:border-0"
              >
                <span className="font-medium">{item.name}</span>
                <span className="truncate text-sm text-muted-foreground">{item.email}</span>
                <Badge variant="outline" className="w-fit capitalize">
                  {item.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold">Settings</h2>
        <p className="mt-2 text-muted-foreground">
          Shape the workspace and keep the platform configuration visible.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold">Workspace identity</h3>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium">
              Platform name
              <Input defaultValue={brand.name} className="mt-2" />
            </label>
            <label className="block text-sm font-medium">
              Support email
              <Input defaultValue="hello@serenity-studio.com" className="mt-2" />
            </label>
            <Button
              className="rounded-full"
              onClick={() => toast.success("Settings saved locally for this preview.")}
            >
              Save settings
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold">Environment</h3>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-muted p-4">
              <span className="text-sm">Template layer</span>
              <Badge variant="outline">Available</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-primary-soft p-4">
              <span className="text-sm">Production layer</span>
              <Badge className="bg-success/10 text-success hover:bg-success/10">Connected</Badge>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Provider credentials and server secrets belong in the deployment environment, never in
              this client-side panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = Math.min(100, Math.round((value / total) * 100));
  return (
    <div>
      <div className="flex justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">
          {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Insight({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-medium text-success">{change} this month</p>
    </div>
  );
}
