import { useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Copy, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "@/lib/AppContext";
import {
  buildRegistrationMessage,
  buildReceiptMessage,
  buildUPIString,
  ORGANIZER_PHONE,
} from "@/lib/hackspirit-utils";
import { uploadToBucket, createRegistration } from "@/lib/hackspirit-cloud";
import { TiltWrapper } from "@/components/hackspirit/TiltWrapper";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { formData, calculatedFee, setCurrentRegistration } = useApp();

  useEffect(() => {
    document.title = "Payment — HACKSPIRIT 2K26";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Complete payment for HACKSPIRIT 2K26 registration.");
    }
  }, []);
  const [step, setStep] = useState(0);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [screenshot, setScreenshot] = useState<{ file: File; preview: string } | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!formData.teamName)
      toast("Please complete your team registration first", { duration: 3000 });
  }, [formData.teamName]);

  if (!formData.teamName) {
    return (
      <div className="min-h-screen px-4 py-16 max-w-xl mx-auto text-center">
        <h1 className="font-display text-3xl gradient-text mb-3">No team details found</h1>
        <p className="text-muted mb-6">Please register your team before continuing to payment.</p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Go to Registration
        </Link>
      </div>
    );
  }

  const upiString = buildUPIString(formData.teamName, calculatedFee);
  const upiId = "9441759500@upi";

  const handleGenerateQR = () => {
    setQrGenerated(true);
    const msg = buildRegistrationMessage(formData, calculatedFee);
    window.open(`https://wa.me/${ORGANIZER_PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success(
      "WhatsApp opened — send the message, complete payment, then come back & click 'I've Paid'",
    );
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast.success("Copied! ✓");
  };

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return toast.error("File too large. Max 10MB.");
    const url = URL.createObjectURL(f);
    setScreenshot({ file: f, preview: url });
  };

  const finish = async () => {
    if (!screenshot || submitting) return;
    if (!transactionId.trim()) {
      return toast.error("Please enter your Transaction ID / UTR number.");
    }
    setSubmitting(true);
    const t = toast.loading("Uploading screenshot to server…");
    try {
      // 1. Upload screenshot to cloud storage
      const ext = (screenshot.file.name.split(".").pop() || "png").toLowerCase();
      const safeTeam = formData.teamName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const path = `screenshots/${Date.now()}_${safeTeam}.${ext}`;
      const publicUrl = await uploadToBucket(screenshot.file, path);

      // 2. Save registration data
      const reg = await createRegistration({
        teamName: formData.teamName,
        teamSize: formData.teamSize,
        totalFee: calculatedFee,
        members: formData.members,
        screenshotUrl: publicUrl,
        transactionId: transactionId.trim(),
      });
      setCurrentRegistration(reg);
      toast.dismiss(t);
      toast.success("Registration saved! Sharing details to host…");

      // 3. Send screenshot to host via WhatsApp — try Web Share API with file first
      const message = buildReceiptMessage(formData.teamName, calculatedFee, transactionId.trim());
      const shareFile = new File([screenshot.file], `HACKSPIRIT_${safeTeam}_payment.${ext}`, {
        type: screenshot.file.type,
      });
      const nav = navigator as unknown as {
        canShare?: (data: { files: File[] }) => boolean;
        share?: (data: { files: File[]; title: string; text: string }) => Promise<void>;
      };
      let shared = false;
      try {
        if (nav.canShare?.({ files: [shareFile] }) ?? false) {
          await nav.share?.({
            files: [shareFile],
            title: "HACKSPIRIT Payment",
            text: message,
          });
          shared = true;
        }
      } catch (error: unknown) {
        console.warn("Web Share cancelled/failed", error);
      }

      // 4. Always also open WhatsApp chat with prefilled message + public link to screenshot
      if (!shared) {
        const waMsg = `${message}\n\n📎 Screenshot uploaded — view it here:\n${publicUrl}`;
        window.open(`https://wa.me/${ORGANIZER_PHONE}?text=${encodeURIComponent(waMsg)}`, "_blank");
      }

      setTimeout(() => navigate("/success"), 600);
    } catch (error: unknown) {
      toast.dismiss(t);
      console.error(error);
      toast.error(
        `Upload failed: ${error instanceof Error ? error.message : "unknown error"}. Please try again.`,
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <Link
        to="/register"
        className="inline-flex items-center gap-1 text-muted hover:text-white mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="flex gap-2 mb-8">
        {["Step 1: Pay", "Step 2: Upload Receipt"].map((label, i) => (
          <div
            key={i}
            className={`flex-1 p-3 rounded-lg text-center text-sm transition ${step === i ? "bg-violet text-white glow" : "glass text-muted"}`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="glass p-5 mb-6">
        <h2 className="font-display text-xl gradient-text break-words">{formData.teamName}</h2>
        <ul className="text-sm text-muted mt-2 space-y-1">
          {formData.members.slice(0, formData.teamSize).map((m, i) => (
            <li key={i}>
              {i + 1}. {m.name} — {m.isIEEE ? "IEEE" : "Non-IEEE"}
            </li>
          ))}
        </ul>
        <div className="font-display text-3xl text-amber mt-3">Total: ₹{calculatedFee}</div>
      </div>

      {step === 0 && (
        <div className="space-y-6">
          {!qrGenerated ? (
            <div className="glass p-6 text-center">
              <p className="text-muted mb-4 text-sm">
                Click the button below to generate the payment QR code. WhatsApp will open so you
                can notify the organizer — don't worry, just send the message, complete payment in
                any UPI app, then come back and click{" "}
                <span className="text-amber">"I've Paid"</span>.
              </p>
              <button className="btn-primary text-lg" onClick={handleGenerateQR}>
                🔳 Generate Payment QR Code
              </button>
            </div>
          ) : (
            <>
              <TiltWrapper className="glass p-6 text-center rounded-xl" maxTilt={5}>
                <div className="inline-block bg-white p-4 rounded-xl">
                  <QRCodeSVG value={upiString} size={240} bgColor="#ffffff" fgColor="#0A0A0F" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                  <code className="bg-surface px-3 py-2 rounded font-mono text-sm">{upiId}</code>
                  <button onClick={copyUpi} className="btn-outline !py-2 !px-4">
                    <Copy size={14} />
                    Copy
                  </button>
                </div>
                <p className="text-xs text-cyan mt-4">
                  📲 WhatsApp notification sent. Complete payment and proceed.
                </p>
              </TiltWrapper>

              <div className="glass p-5">
                <h3 className="font-display text-lg mb-3">Payment Steps</h3>
                <ol className="space-y-2 text-sm">
                  <li>1. ✅ QR Generated</li>
                  <li>2. 📱 Open any UPI app — scan the QR</li>
                  <li>3. 💸 Pay exactly ₹{calculatedFee}</li>
                  <li>4. 📸 Screenshot the success screen</li>
                  <li>5. ⬆️ Upload on next step</li>
                </ol>
              </div>

              <button onClick={() => setStep(1)} className="btn-primary w-full">
                I've Paid → Upload Receipt
              </button>
            </>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl gradient-text">Upload Payment Receipt</h2>

          <label
            htmlFor="receipt-file"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className="block border-2 border-dashed border-violet/40 hover:border-violet rounded-xl p-6 text-center cursor-pointer transition"
          >
            {screenshot ? (
              <div>
                <img
                  src={screenshot.preview}
                  alt="receipt"
                  className="max-h-64 mx-auto rounded-lg mb-3"
                />
                <p className="text-sm text-muted">
                  {screenshot.file.name} ({(screenshot.file.size / 1024).toFixed(0)} KB)
                </p>
                <p className="text-xs text-cyan mt-1">Tap to replace</p>
              </div>
            ) : (
              <div>
                <Upload size={40} className="mx-auto mb-3 text-violet" />
                <p className="font-medium">Tap here to choose your screenshot</p>
                <p className="text-xs text-muted mt-1">or drag &amp; drop · Max 10MB · JPG/PNG</p>
              </div>
            )}
          </label>

          <input
            id="receipt-file"
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {!screenshot && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-outline w-full"
            >
              📁 Choose Screenshot from Device
            </button>
          )}

          <div className="space-y-2 text-left">
            <label htmlFor="transaction-id" className="block text-sm font-medium text-muted">
              Transaction ID / UTR Number <span className="text-red">*</span>
            </label>
            <input
              id="transaction-id"
              type="text"
              required
              placeholder="Enter 12-digit UTR or Transaction Ref ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-surface border border-violet/30 focus:border-violet rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-violet transition"
            />
          </div>

          <div className="glass p-4 text-sm text-muted space-y-1">
            <p>
              ℹ️ When you click <span className="text-amber">"Send Receipt &amp; Finish"</span>:
            </p>
            <p>
              1. Your screenshot is{" "}
              <span className="text-cyan">uploaded securely to the server</span>.
            </p>
            <p>2. Your registration is saved to the host's dashboard automatically.</p>
            <p>
              3. WhatsApp opens — if your phone supports it, the image attaches automatically;
              otherwise a public link to it is included in the message.
            </p>
            <p className="pt-2 border-t border-white/10 mt-2">
              Entry Pass will be sent to{" "}
              <span className="text-cyan">{formData.members[0].email}</span> after verification.
            </p>
          </div>

          <div className="flex gap-3 justify-between">
            <button onClick={() => setStep(0)} className="btn-outline" disabled={submitting}>
              ← Back
            </button>
            <button disabled={!screenshot || submitting} onClick={finish} className="btn-primary">
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Sending…
                </>
              ) : (
                <>📤 Send Receipt &amp; Finish</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}