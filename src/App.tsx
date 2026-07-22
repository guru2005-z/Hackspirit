import React, { Component, ErrorInfo, ReactNode, useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import { AppProvider } from "./lib/AppContext";
import { IntroAnimation } from "./components/hackspirit/IntroAnimation";
import { AnimatedBackground } from "./components/hackspirit/AnimatedBackground";
import { reportLovableError } from "./lib/lovable-error-reporting";

import LandingPage from "./routes/index";
import RegisterPage from "./routes/register";
import PaymentPage from "./routes/payment";
import SuccessPage from "./routes/success";
import AdminPage from "./routes/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    reportLovableError(error, { boundary: "react_error_boundary" });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold">This page didn't load</h1>
            <p className="mt-2 text-sm text-muted">Something went wrong.</p>
            {this.state.error && (
              <pre className="mt-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-xl text-left overflow-auto max-h-48 font-mono select-all">
                <strong>Error:</strong> {this.state.error.toString()}
                {this.state.error.stack && (
                  <div className="mt-2 opacity-80 text-[10px] leading-relaxed">
                    {this.state.error.stack.split("\n").slice(0, 5).join("\n")}
                  </div>
                )}
              </pre>
            )}
            <div className="mt-6 flex gap-2 justify-center">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="btn-primary"
              >
                Try again
              </button>
              <a href="/" className="btn-outline">
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainLayout() {
  const [showIntro, setShowIntro] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("hackspirit_intro_seen")) {
      setShowIntro(true);
      sessionStorage.setItem("hackspirit_intro_seen", "true");
    }
  }, []);

  useEffect(() => {
    // Only initialize and play BGM (reg_sound.mp3) once the intro is NOT showing
    if (showIntro) return;

    const audio = new Audio("/reg_sound.mp3");
    audio.volume = 0.5;
    audio.loop = true;
    bgmRef.current = audio;
    audio.load();

    let played = false;
    const playBGM = () => {
      if (played) return;
      audio.play().then(() => {
        played = true;
        cleanupListeners();
      }).catch((e) => {
        console.warn("BGM autoplay blocked:", e);
      });
    };

    const cleanupListeners = () => {
      window.removeEventListener("mousemove", playBGM);
      window.removeEventListener("keydown", playBGM);
      window.removeEventListener("touchstart", playBGM);
      window.removeEventListener("scroll", playBGM);
      window.removeEventListener("mousedown", playBGM);
    };

    // Micro-interaction listeners to unlock audio as early as possible
    window.addEventListener("mousemove", playBGM);
    window.addEventListener("keydown", playBGM);
    window.addEventListener("touchstart", playBGM);
    window.addEventListener("scroll", playBGM);
    window.addEventListener("mousedown", playBGM);

    // Attempt direct autoplay
    audio.play().then(() => {
      played = true;
      cleanupListeners();
    }).catch((e) => {
      console.warn("Direct BGM autoplay blocked, waiting for interaction...");
    });

    return () => {
      cleanupListeners();
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, [showIntro]);

  return (
    <>
      <AnimatedBackground />
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onDone={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
      <div id="app-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundComponent />} />
        </Routes>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#12121A",
            color: "#fff",
            border: "1px solid rgba(124,58,237,0.3)",
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
