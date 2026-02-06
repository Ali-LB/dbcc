import { Suspense } from "react";
import ResetClient from "./ResetClient";

function ResetFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="text-lg text-gray-600">Loading reset form...</div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetFallback />}>
      <ResetClient />
    </Suspense>
  );
}
