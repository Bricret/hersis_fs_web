"use client";

import { useState, useEffect } from "react";
import { RocketIcon, XIcon } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

interface BannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
}

export default function Banner({
  title,
  description,
  buttonText,
  buttonAction,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 mx-4 mb-4 transition-all duration-300 ease-in-out transform ${
        isMounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="dark bg-muted text-foreground px-4 py-3 rounded-lg shadow-lg">
        <div className="flex gap-2 md:items-center">
          <div className="flex grow gap-3 md:items-center">
            <div
              className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
              aria-hidden="true"
            >
              <RocketIcon className="opacity-80" size={16} />
            </div>
            <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
              <div className="flex gap-2 max-md:flex-wrap">
                <Button size="sm" className="text-sm" onClick={buttonAction}>
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => setIsVisible(false)}
            aria-label="Close banner"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
