"use client";
import Start from "./components/Start";
import User from "./components/User";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <section className=" flex justify-center items-center">
      {session?.user && <User />}
      {!session?.user && <Start />}
    </section>
  );
}
