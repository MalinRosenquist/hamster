import type { Metadata } from "next";
import MyPageClient from "./MyPageClient";

export const metadata: Metadata = {
  title: "Min sida",
};

export default function Page() {
  return <MyPageClient />;
}
