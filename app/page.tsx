import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import User from "./components/User";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <section>
      <h1>Home</h1>
      <h2>SSR</h2>
      <pre>{JSON.stringify(session)}</pre>
      <User />
    </section>
  );
}
