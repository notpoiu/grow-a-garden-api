import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Grow A Garden API</h1>
      <p className="text-fd-muted-foreground">
        A RESTful API to fetch grow a garden data of Grow A Garden.
        <br />
        Go to{" "}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          /docs
        </Link>{" "}
        to see the API documentation.
      </p>
    </main>
  );
}
