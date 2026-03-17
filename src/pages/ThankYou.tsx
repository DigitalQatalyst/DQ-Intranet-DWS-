export default function ThankYou() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-semibold text-[#030F35] sm:text-4xl">
          Thank you!
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Your application has been submitted. We’ll get back to you shortly.
        </p>
      </div>
    </div>
  );
}
