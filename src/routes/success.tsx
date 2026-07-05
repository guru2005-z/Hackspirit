import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/AppContext";
import { ConfettiEffect } from "@/components/hackspirit/ConfettiEffect";
import { ORGANIZER_PHONE } from "@/lib/hackspirit-utils";
import { TiltWrapper } from "@/components/hackspirit/TiltWrapper";

export default function SuccessPage() {
  const navigate = useNavigate();
  const { currentRegistration } = useApp();

  useEffect(() => {
    document.title = "Registered! — HACKSPIRIT 2K26";
  }, []);

  useEffect(() => {
    if (!currentRegistration) navigate("/");
  }, [currentRegistration, navigate]);

  if (!currentRegistration) return null;
  const r = currentRegistration;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
      <ConfettiEffect />
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.7 }}
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="#10B981" strokeWidth="4" />
        <motion.path
          d="M28 52 L44 68 L74 36"
          fill="none"
          stroke="#10B981"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.svg>
      <h1 className="font-display text-4xl sm:text-5xl gradient-text mt-6">
        You're Registered! 🎉
      </h1>
      <p className="text-muted mt-3 max-w-md">
        All the best, <span className="text-cyan">{r.teamName}</span>! Your HACKSPIRIT 2K26 entry
        has been received.
      </p>

      <div className="glass p-5 mt-6 max-w-md w-full text-left">
        <p className="text-sm">
          📧 Entry pass will be emailed to <span className="text-cyan">{r.members[0].email}</span>
        </p>
      </div>

      <TiltWrapper className="glass p-5 mt-4 max-w-md w-full text-left text-sm space-y-2 rounded-xl" maxTilt={6}>
        <div className="flex justify-between">
          <span className="text-muted">Team Name</span>
          <span>{r.teamName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Team Size</span>
          <span>{r.teamSize}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Amount Paid</span>
          <span className="text-amber">₹{r.totalFee}</span>
        </div>
        {r.transactionId && (
          <div className="flex justify-between">
            <span className="text-muted">Transaction ID</span>
            <span className="font-mono text-xs text-cyan">{r.transactionId}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted">Registration ID</span>
          <span className="font-mono text-xs">{r.id}</span>
        </div>
      </TiltWrapper>

      <div className="flex gap-3 mt-8 flex-wrap justify-center">
        <button
          onClick={() => {
            const message = `🎯 *HACKSPIRIT 2K26 – Payment Receipt & Details!*\n\nTeam Name: ${r.teamName}\nRegistration ID: ${r.id}\nAmount Paid: ₹${r.totalFee}\nTransaction ID: ${r.transactionId}\n\n📎 Payment Screenshot Link:\n${r.paymentScreenshotBase64}\n\nPlease confirm our registration.`;
            window.open(`https://wa.me/${ORGANIZER_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          💬 Share Details on WhatsApp
        </button>
        <Link to="/" className="btn-outline">
          🏠 Back to Home
        </Link>
      </div>
    </div>
  );
}