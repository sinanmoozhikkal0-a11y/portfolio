"use client";

import BackgroundCanvas from "@/components/BackgroundCanvas";
import TargetCursor from "@/components/TargetCursor";
import LenisProvider from "@/components/LenisProvider";
import TransitionOverlay from "@/components/TransitionOverlay";
import IntroLoader from "@/components/IntroLoader";

export default function ClientShell() {
  return (
    <>
      {/* Smooth Scroll Initialization */}
      <LenisProvider />

      {/* Premium preloader animation */}
      <IntroLoader />

      {/* Liquid page transition overlay */}
      <TransitionOverlay />

      {/* Background Canvas (Slow floating particles + Parallax) */}
      <BackgroundCanvas />

      {/* Custom Interactive B&W Cursor */}
      <TargetCursor 
        spinDuration={2.5}
        hideDefaultCursor={true}
        parallaxOn={true}
        cursorColor="#ffffff"
        cursorColorOnTarget="#ffffff"
        targetSelector="a, button, [role='button'], .cursor-target, .cursor-pointer, .nav-link, .magnetic-btn-wrap"
      />
    </>
  );
}
