"use client";
import { Button } from "@/components/ui/button";
import { AccountView } from "@daveyplate/better-auth-ui";
import { accountViewPaths } from "@daveyplate/better-auth-ui/server";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountPage({ path }: { path: string }) {
  const router = useRouter();
  return (
    <main className="container p-4 md:p-6">
      <Button variant={"secondary"} onClick={() => router.back()}>
        <ArrowLeft />
        Back
      </Button>

      <AccountView path={path} />
    </main>
  );
}

export async function getStaticPaths() {
  return {
    paths: Object.values(accountViewPaths).map((path) => ({
      params: { path },
    })),
    fallback: false,
  };
}

// export async function getStaticProps({ params }: { params: { path: string } }) {
//   return { props: { path: params.path } };
// }
