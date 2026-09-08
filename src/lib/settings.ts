export type ProviderId = "gemini" | "claude" | "openai";

export interface AppSettings {
  selectedProvider: ProviderId;
  keys: Record<ProviderId, string>;
}

const STORAGE_KEY = "pole-extractor:settings";

const DEFAULT_SETTINGS: AppSettings = {
  selectedProvider: "gemini",
  keys: { gemini: "", claude: "", openai: "" },
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw);
    return {
      selectedProvider: parsed.selectedProvider ?? DEFAULT_SETTINGS.selectedProvider,
      keys: { ...DEFAULT_SETTINGS.keys, ...parsed.keys },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
