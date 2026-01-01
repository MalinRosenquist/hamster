import type { PaginatedResponse } from "./PaginatedResponse";
import type { Theme } from "./Theme";
import type { SetInfo } from "./SetInfo";

export type ThemesResponse = PaginatedResponse<Theme>;
export type SetListResponse = PaginatedResponse<SetInfo>;
