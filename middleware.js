// middleware.ts (Next.js 12+)
import { withAuth } from "next-auth/middleware";
import { getSession } from "next-auth/react";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "admin",
  },
});

// Protege rutas en pages:
export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session?.user.role !== "admin") {
    return { redirect: { destination: "/login" } };
  }
  return { props: {} };
};
