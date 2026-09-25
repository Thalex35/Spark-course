export type PlatformMode = "template" | "production";

const configuredMode = import.meta.env.VITE_APP_MODE as PlatformMode | undefined;

export const platformMode: PlatformMode = configuredMode === "template" ? "template" : "production";

export const isTemplateMode = platformMode === "template";

export const dataSourceLabel = isTemplateMode ? "Demo data source" : "Supabase data source";

export const platformStatus = {
  mode: platformMode,
  isTemplateMode,
  dataSourceLabel,
};
