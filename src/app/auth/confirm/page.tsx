import { Suspense } from "react";
import ConfirmClient from "./ConfirmClient";

function ConfirmFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="text-lg text-gray-600">Confirming your email...</div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<ConfirmFallback />}>
      <ConfirmClient />
    </Suspense>
  );
}
