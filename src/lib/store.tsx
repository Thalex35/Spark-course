import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { courseLessons, getCourse } from "./data";
import { platformMode } from "./platform";
import { getSupabaseClient, isSupabaseConfigured, supabase } from "./supabase";

export type DemoUser = {
  name: string;
  email: string;
  phone: string;
  bio: string;
};

type AppState = {
  user: DemoUser | null;
  enrollments: { courseId: string; enrolledAt: string; lastAccessed: string }[];
  completed: Record<string, string[]>;
  wishlist: string[];
};

const STORAGE_KEY = "serenity-studio-demo";

const emptyState: AppState = { user: null, enrollments: [], completed: {}, wishlist: [] };

type AppContextValue = {
  ready: boolean;
  user: DemoUser | null;
  enrollments: AppState["enrollments"];
  wishlist: string[];
  signIn: (email: string, name?: string, password?: string) => Promise<void>;
  signUp: (email: string, name: string, password: string) => Promise<void>;
  signInWithProvider: (provider: "google" | "facebook", redirect?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<DemoUser>) => Promise<void>;
  enroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  toggleWishlist: (courseId: string) => void;
  touchCourse: (courseId: string) => void;
  isLessonComplete: (courseId: string, lessonId: string) => boolean;
  toggleLesson: (courseId: string, lessonId: string) => void;
  completedCount: (courseId: string) => number;
  progress: (courseId: string) => number;
  minutesLearned: () => number;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (platformMode === "production") {
      if (!isSupabaseConfigured || !supabase) {
        setReady(true);
        return;
      }

      let active = true;
      const client = getSupabaseClient();
      const syncUser = async () => {
        const { data } = await client.auth.getSession();
        if (!active) return;
        const authUser = data.session?.user;
        setState((current) => ({
          ...current,
          user: authUser
            ? {
                name: String(
                  authUser.user_metadata?.full_name ??
                    authUser.user_metadata?.name ??
                    authUser.email?.split("@")[0] ??
                    "Student",
                ),
                email: authUser.email ?? "",
                phone: String(authUser.user_metadata?.phone ?? ""),
                bio: String(authUser.user_metadata?.bio ?? ""),
              }
            : null,
        }));
        setReady(true);
      };

      void syncUser();
      const { data: subscription } = client.auth.onAuthStateChange(() => {
        void syncUser();
      });

      return () => {
        active = false;
        subscription.subscription.unsubscribe();
      };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...emptyState, ...(JSON.parse(raw) as AppState) });
    } catch {
      /* ignore corrupted demo data */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || platformMode === "production") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const value = useMemo<AppContextValue>(() => {
    const isEnrolled = (courseId: string) => state.enrollments.some((e) => e.courseId === courseId);
    const completedCount = (courseId: string) => state.completed[courseId]?.length ?? 0;
    const progress = (courseId: string) => {
      const course = getCourse(courseId);
      if (!course) return 0;
      const total = courseLessons(course).length;
      return total ? Math.round((completedCount(courseId) / total) * 100) : 0;
    };

    return {
      ready,
      user: state.user,
      enrollments: state.enrollments,
      wishlist: state.wishlist,
      signIn: async (email, name, password) => {
        if (platformMode === "production") {
          const client = getSupabaseClient();
          const { error } = await client.auth.signInWithPassword({
            email,
            password: password ?? "",
          });
          if (error) throw error;
          return;
        }

        setState((s) => ({
          ...s,
          user: s.user ?? {
            name: name?.trim() || email.split("@")[0]!.replace(/[._-]/g, " ") || "Student",
            email,
            phone: "",
            bio: "",
          },
        }));
      },
      signUp: async (email, name, password) => {
        if (platformMode === "production") {
          const client = getSupabaseClient();
          const { data, error } = await client.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
          });
          if (error) throw error;
          if (data.user && data.session) {
            await client.from("profiles").upsert({ id: data.user.id, email, full_name: name });
          }
          return;
        }

        setState((s) => ({
          ...s,
          user: { name, email, phone: "", bio: "" },
        }));
      },
      signInWithProvider: async (provider, redirect) => {
        if (platformMode !== "production") {
          setState((s) => ({
            ...s,
            user: s.user ?? {
              name: provider === "google" ? "Google Student" : "Facebook Student",
              email: `${provider}@example.com`,
              phone: "",
              bio: "",
            },
          }));
          return;
        }

        const client = getSupabaseClient();
        const { error } = await client.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`,
          },
        });
        if (error) throw error;
      },
      signOut: async () => {
        if (platformMode === "production") {
          const { error } = await getSupabaseClient().auth.signOut();
          if (error) throw error;
          return;
        }
        setState((s) => ({ ...s, user: null }));
      },
      updateUser: async (patch) => {
        if (platformMode === "production") {
          const client = getSupabaseClient();
          const { data } = await client.auth.getUser();
          if (!data.user) return;
          const next = { ...state.user, ...patch };
          const { error } = await client.auth.updateUser({
            data: { full_name: next.name, phone: next.phone, bio: next.bio },
          });
          if (error) throw error;
          const { error: profileError } = await client.from("profiles").upsert({
            id: data.user.id,
            email: next.email,
            full_name: next.name,
            phone: next.phone,
            bio: next.bio,
          });
          if (profileError) throw profileError;
        }
        setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
      },
      enroll: (courseId) =>
        setState((s) =>
          s.enrollments.some((e) => e.courseId === courseId)
            ? s
            : {
                ...s,
                wishlist: s.wishlist.filter((w) => w !== courseId),
                enrollments: [
                  ...s.enrollments,
                  {
                    courseId,
                    enrolledAt: new Date().toISOString(),
                    lastAccessed: new Date().toISOString(),
                  },
                ],
              },
        ),
      isEnrolled,
      toggleWishlist: (courseId) =>
        setState((s) => ({
          ...s,
          wishlist: s.wishlist.includes(courseId)
            ? s.wishlist.filter((w) => w !== courseId)
            : [...s.wishlist, courseId],
        })),
      touchCourse: (courseId) =>
        setState((s) => ({
          ...s,
          enrollments: s.enrollments.map((e) =>
            e.courseId === courseId ? { ...e, lastAccessed: new Date().toISOString() } : e,
          ),
        })),
      isLessonComplete: (courseId, lessonId) => !!state.completed[courseId]?.includes(lessonId),
      toggleLesson: (courseId, lessonId) =>
        setState((s) => {
          const list = s.completed[courseId] ?? [];
          const next = list.includes(lessonId)
            ? list.filter((l) => l !== lessonId)
            : [...list, lessonId];
          return { ...s, completed: { ...s.completed, [courseId]: next } };
        }),
      completedCount,
      progress,
      minutesLearned: () =>
        Object.entries(state.completed).reduce((sum, [courseId, lessonIds]) => {
          const course = getCourse(courseId);
          if (!course) return sum;
          const lessons = courseLessons(course);
          return (
            sum +
            lessons.filter((l) => lessonIds.includes(l.id)).reduce((a, l) => a + l.duration, 0)
          );
        }, 0),
    };
  }, [state, ready]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

/** Formats a price using the template's currency settings. */
export function useCurrency() {
  return useCallback((amount: number) => `$${amount}`, []);
}

export function formatPrice(amount: number) {
  return `$${amount}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
