"use client";

import dynamic from "next/dynamic";
import loadingAnimation from "@/resources/animations/loadingAnim.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-screen p-4">
    <Lottie
      animationData={loadingAnimation}
      loop={true}
      className="w-32 h-32"
    />
    <span className="mt-4 text-gray-600">Cargando...</span>
  </div>
);
