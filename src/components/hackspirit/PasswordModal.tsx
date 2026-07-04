import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { HOST_PASSWORD } from "@/lib/hackspirit-utils";

export function PasswordModal({
  open,
  onClose,
  onSuccess,
  title = "Enter Password",
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
}) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (pw === HOST_PASSWORD) {
      setPw("");
      setErr("");
      onSuccess();
    } else setErr("Incorrect password");
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
            className="glass p-6 w-full max-w-sm relative"
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
            <h3 className="font-display text-xl mb-4 gradient-text">{title}</h3>
            <input
              type="password"
              value={pw}
              autoFocus
              onChange={(e) => {
                setPw(e.target.value);
                setErr("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="input-field"
              placeholder="Password"
            />
            {err && <p className="text-red-400 text-sm mt-2">{err}</p>}
            <button onClick={submit} className="btn-primary w-full mt-4">
              Unlock
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
