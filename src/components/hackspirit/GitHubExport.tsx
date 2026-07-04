import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5.1 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
  </svg>
);

const STEPS = [
  "Open the Lovable editor for this project.",
  "Click the Plus (+) menu in the chat input (bottom-left).",
  "Select GitHub → Connect project.",
  "Authorize the Lovable GitHub App.",
  "Choose the account/organization and click Create Repository.",
  "Once synced, visit the repo on GitHub and click Code → Download ZIP or run git clone <repo-url>.",
];

export function GitHubExport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copySteps = () => {
    navigator.clipboard.writeText(STEPS.map((s, i) => `${i + 1}. ${s}`).join("\n"));
    setCopied(true);
    toast.success("Steps copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass p-6 w-full max-w-md relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-muted hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <GitHubIcon />
              <h3 className="font-display text-xl gradient-text">Export to GitHub</h3>
            </div>
            <p className="text-sm text-muted mb-4">
              Lovable can sync your entire codebase to a GitHub repository. Follow these steps to
              download it as a repo:
            </p>
            <ol className="space-y-3 text-sm list-decimal list-inside text-foreground/90 mb-6">
              {STEPS.map((step, i) => (
                <li key={i} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={copySteps} className="btn-outline flex-1 !py-2">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy Steps"}
              </button>
              <a
                href="https://docs.lovable.dev/integrations/github"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 !py-2"
              >
                <ExternalLink size={16} /> Lovable Docs
              </a>
            </div>
            <p className="text-xs text-muted mt-4 text-center">
              The actual sync is handled by Lovable’s platform; this panel is a quick helper.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
