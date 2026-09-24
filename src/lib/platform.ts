export type PlatformMode = "template" | "production";

export const platformMode: PlatformMode =
  (import.meta.env.VITE_APP_MODE as PlatformMode | undefined) === "production"
    ? "production"
    : "template";

export const isTemplateMode = platformMode === "template";

export const dataSourceLabel = isTemplateMode ? "Demo data source" : "Supabase data source";

export const platformStatus = {
  mode: platformMode,
  isTemplateMode,
  dataSourceLabel,
};
