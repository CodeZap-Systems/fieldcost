export default function DemoSignup() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <section className="bg-white p-8 rounded shadow-md w-full max-w-xl text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">Demo access paused</p>
        <h1 className="text-2xl font-bold">FieldCost guided trials</h1>
        <p className="text-gray-600">
          We are focusing onboarding through the new registration flow so every workspace carries real context and
          company data. Please use the Register option in the sidebar to request access, and we will email confirmation
          instructions immediately.
        </p>
        <p className="text-sm text-gray-500">
          Already have an account? Use Login to continue. The previous self-serve demo creation has been retired to keep
          environments consistent.
        </p>
      </section>
    </main>
  );
}
