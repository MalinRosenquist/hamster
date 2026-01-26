import "server-only";
import path from "path";
import { promises as fs } from "fs";

export function mockDataEnabled(): boolean {
  return process.env.USE_MOCK_DATA === "1";
}

export async function readMockJson<T>(relativePathFromMockRoot: string): Promise<T> {
  const fullPath = path.join(
    process.cwd(),
    "src",
    "mock-data",
    relativePathFromMockRoot
  );

  try {
    const raw = await fs.readFile(fullPath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    throw new Error(
      `Missing/invalid mock file: src/mock-data/${relativePathFromMockRoot}. ${msg}`
    );
  }
}
