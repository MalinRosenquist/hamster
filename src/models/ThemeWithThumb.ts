import { Theme } from "./Theme";

export type ThemeWithThumb = Theme & {
  thumb: string | null;
};
