/**
 * Demo data layer: mock authentication, enrollments and lesson progress,
 * all persisted to localStorage. Swap this file for real API calls later.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { courseLessons, getCourse } from "./data";

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
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  updateUser: (patch: Partial<DemoUser>) => void;
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

  // Hydrate from localStorage after mount so SSR markup stays stable.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...emptyState, ...(JSON.parse(raw) as AppState) });
    } catch {
      /* ignore corrupted demo data */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
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
      signIn: (email, name) =>
        setState((s) => ({
          ...s,
          user: s.user ?? {
            name: name?.trim() || email.split("@")[0]!.replace(/[._-]/g, " ") || "Student",
            email,
            phone: "",
            bio: "",
          },
        })),
      signOut: () => setState((s) => ({ ...s, user: null })),
      updateUser: (patch) => setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s)),
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
          const next = list.includes(lessonId) ? list.filter((l) => l !== lessonId) : [...list, lessonId];
          return { ...s, completed: { ...s.completed, [courseId]: next } };
        }),
      completedCount,
      progress,
      minutesLearned: () =>
        Object.entries(state.completed).reduce((sum, [courseId, lessonIds]) => {
          const course = getCourse(courseId);
          if (!course) return sum;
          const lessons = courseLessons(course);
          return sum + lessons.filter((l) => lessonIds.includes(l.id)).reduce((a, l) => a + l.duration, 0);
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
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
