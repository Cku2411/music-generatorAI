import { OrganizationView } from "@daveyplate/better-auth-ui";
import { organizationViewPaths } from "@daveyplate/better-auth-ui/server";

export default function OrganizationPage({ path }: { path: string }) {
  return (
    <main className="container p-4 md:p-6">
      <OrganizationView path={path} />
    </main>
  );
}

export async function getStaticPaths() {
  return {
    paths: Object.values(organizationViewPaths).map((path) => ({
      params: { path },
    })),
    fallback: false,
  };
}

// export async function getStaticProps({ params }: { params: { path: string } }) {
//   return { props: { organizationView: params.path } };
// }
