export default function Home() {
  return (
    <div className="mx-auto max-w-[600px] px-6 py-16">
      <h1 className="mb-3 text-2xl font-bold">Digital Code QR</h1>
      <p className="text-gray-600">
        This is the app server for the Salla app. The merchant-facing UI lives at{" "}
        <code className="rounded bg-gray-100 px-1">/embed</code>, loaded inside the Salla dashboard iframe — it is
        not meant to be visited directly. See <code className="rounded bg-gray-100 px-1">README.md</code> for setup.
      </p>
    </div>
  );
}
