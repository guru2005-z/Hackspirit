import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Phone, X, Plus, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { CountdownTimer } from "@/components/hackspirit/CountdownTimer";
import { PasswordModal } from "@/components/hackspirit/PasswordModal";
import { TiltWrapper } from "@/components/hackspirit/TiltWrapper";
import { useMouseParallax } from "@/components/hackspirit/useMouseParallax";
import { useApp } from "@/lib/AppContext";
import { COUNTDOWN_TARGET } from "@/lib/hackspirit-utils";
import {
  uploadToBucket,
  fetchSettings,
  saveProblemStatement,
  saveGalleryUrls,
} from "@/lib/hackspirit-cloud";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const CONTACTS = [
  {
    name: "N. Upali",
    role: "Chair, IEEE Student Branch",
    phone: "6305349156",
    email: "upalinijamaala@gmail.com",
  },
  { name: "K Guravaiah", role: "Vice Chair, IEEE Student Branch", phone: "9491501919", email: "" },
  {
    name: "Kanumuru Rithika",
    role: "Secretary, IEEE Student Branch",
    phone: "7708731095",
    email: "rithikareddyk2005@gmail.com",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { setAdminAuth } = useApp();

  useEffect(() => {
    document.title = "HACKSPIRIT 2K26 — IEEE Student Branch Hackathon";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Register for HACKSPIRIT 2K26 — a 6-hour college hackathon by IEEE Student Branch, NBKRIST. Open to all tech branches."
      );
    }
  }, []);
  const parallax = useMouseParallax(12); // degrees of drift for hero depth layers
  const [contactOpen, setContactOpen] = useState(false);
  const [hostPwOpen, setHostPwOpen] = useState(false);
  const [adminPwOpen, setAdminPwOpen] = useState(false);
  const [galleryPwOpen, setGalleryPwOpen] = useState(false);
  const [expired, setExpired] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [adminSession, setAdminSession] = useState(false);
  const [galleryImgs, setGalleryImgs] = useState<(string | null)[]>([null, null, null]);
  const [uploading, setUploading] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const galleryRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    setAdminSession(sessionStorage.getItem("hackspirit_admin_session") === "true");
    fetchSettings()
      .then((s) => {
        setPdfUrl(s.problem_statement_url);
        setGalleryImgs([
          s.gallery_urls[0] ?? null,
          s.gallery_urls[1] ?? null,
          s.gallery_urls[2] ?? null,
        ]);
      })
      .catch((e) => console.warn("settings load failed", e));
  }, []);

  const onPdfFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) return toast.error("Max 20MB");
    setUploading(true);
    const t = toast.loading("Uploading problem statement…");
    try {
      const url = await uploadToBucket(
        f,
        `problem-statement/HACKSPIRIT_Problem_Statements_${Date.now()}.pdf`,
      );
      await saveProblemStatement(url);
      setPdfUrl(url);
      toast.dismiss(t);
      toast.success("Problem statement published! ✓");
    } catch (error: unknown) {
      toast.dismiss(t);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  };

  const viewPdf = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const onGalleryFile = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    const t = toast.loading("Uploading…");
    try {
      const url = await uploadToBucket(
        f,
        `gallery/img_${idx}_${Date.now()}.${f.name.split(".").pop() || "jpg"}`,
      );
      const next = [...galleryImgs];
      next[idx] = url;
      setGalleryImgs(next);
      await saveGalleryUrls(next);
      toast.dismiss(t);
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.dismiss(t);
      console.error("Gallery upload error:", error);
      const errMsg = error?.message || (typeof error === "string" ? error : "Upload failed");
      toast.error(errMsg);
    }
    e.target.value = "";
  };

  const scrollToSchedule = () =>
    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* TOP NAV BAR */}
      <div className="fixed top-0 left-0 right-0 z-30 glass px-4 sm:px-8 py-2 flex items-center justify-between">
        <img
          src="/nbkrist-logo.png"
          alt="NBKR Institute of Science and Technology Logo"
          className="h-10 sm:h-14 w-auto object-contain"
        />
        <div className="glass px-3 py-1.5 flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="hidden sm:inline">LIVE REGISTRATION OPEN</span>
          <span className="sm:hidden">LIVE</span>
        </div>
        <img
          src="/college-logo.png"
          alt="IEEE Student Branch NBKRIST Logo"
          className="h-10 sm:h-14 w-auto object-contain"
        />
      </div>

      {/* HERO */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16"
        style={{ perspective: "1200px" }}
      >
        <div
          style={{
            transform: `translate3d(${parallax.x * -1}px, ${parallax.y * -1}px, 0)`,
            transition: "transform 0.25s ease-out",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted tracking-widest uppercase text-xs sm:text-sm mb-4"
          >
            IEEE Student Branch Event
          </motion.p>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="font-display font-black gradient-text leading-none w-full max-w-full break-words"
            style={{
              fontSize: "clamp(40px, 11vw, 144px)",
              transform: `translate3d(${parallax.x * -1.8}px, ${parallax.y * -1.8}px, 0)`,
              transition: "transform 0.2s ease-out",
              textShadow: `${parallax.x * -0.6}px ${parallax.y * -0.6}px 24px rgba(124,58,237,0.35)`,
            }}
          >
            HACKSPIRIT
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-cyan mt-4 tracking-[0.25em] text-xs sm:text-base"
          >
            CODE. CREATE. ELEVATE.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted max-w-2xl mx-auto mt-6 text-sm sm:text-base"
          >
            A 6-hour sprint where bold ideas become working prototypes. Build something brilliant
            with your team, get expert feedback, and walk away with ₹10K prize money & certificates.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3 justify-center mt-8"
          >
            <button className="btn-primary" onClick={() => navigate("/register")}>
              Start Registration
            </button>
            <button className="btn-outline" onClick={scrollToSchedule}>
              View Schedule
            </button>
          </motion.div>
          <button className="btn-outline mt-4" onClick={() => setContactOpen((o) => !o)}>
            {contactOpen ? "Hide Contact" : "Contact Us"}
          </button>
        </div>

        {contactOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden w-full max-w-3xl mx-auto mt-6"
          >
            <div className="glass p-4 sm:p-6 relative">
              <button
                onClick={() => setContactOpen(false)}
                className="absolute top-3 right-3 text-muted hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="font-display text-xl mb-4">📞 Contact Us</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {CONTACTS.map((c, i) => (
                  <div key={i} className="glass p-3 sm:p-4 flex items-start gap-3 text-left">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-surface flex items-center justify-center text-muted">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{c.name}</div>
                      <div className="text-cyan text-xs">{c.role}</div>
                      {c.phone && (
                        <a
                          href={`tel:${c.phone}`}
                          className="text-amber text-sm flex items-center gap-1 mt-1"
                        >
                          <Phone size={12} />
                          {c.phone}
                        </a>
                      )}
                      {c.email && (
                        <a
                          href={`mailto:${c.email}`}
                          className="text-muted text-xs flex items-center gap-1 mt-0.5 break-all"
                        >
                          <Mail size={12} />
                          {c.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.h2 {...fadeUp} className="font-display text-3xl sm:text-4xl text-center">
          <span className="gradient-text">Event Highlights</span>
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {[
            { icon: "⏱", title: "6-Hour Sprint", desc: "Intense, focused build time" },
            {
              icon: "🎓",
              title: "Open to All Tech Branches",
              desc: "CSE, IT, ECE, AI&DS and more",
            },
            {
              icon: "🏆",
              title: "Expert Evaluations",
              desc: "Industry mentors judge every project",
            },
            { icon: "🎁", title: "₹10K Prize Money", desc: "For top performers and participants" },
          ].map((h, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 0 32px rgba(124,58,237,0.4)" }}
            >
              <TiltWrapper className="glass p-6 rounded-xl">
                <div className="text-4xl mb-3">{h.icon}</div>
                <h3 className="font-display text-xl mb-1">{h.title}</h3>
                <p className="text-muted text-sm">{h.desc}</p>
              </TiltWrapper>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRACKS */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.h2
          {...fadeUp}
          className="font-display text-3xl sm:text-4xl text-center gradient-text"
        >
          What Can You Build?
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {[
            {
              icon: "🤖",
              title: "AI / ML",
              desc: "Computer vision, NLP, generative AI, smart agents.",
              tags: ["Python", "TensorFlow", "LLMs", "OpenCV"],
            },
            {
              icon: "🌐",
              title: "Full Stack",
              desc: "End-to-end web & mobile apps that solve real problems.",
              tags: ["React", "Node", "Database", "APIs"],
            },
          ].map((t, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <TiltWrapper className="glass p-6 border-l-4 border-cyan rounded-xl" maxTilt={8}>
                <div className="text-5xl mb-3">{t.icon}</div>
                <h3 className="font-display text-2xl mb-2">{t.title}</h3>
                <p className="text-muted mb-4">{t.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-violet/20 text-violet border border-violet/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TiltWrapper>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="py-20 px-4 max-w-4xl mx-auto">
        <motion.h2
          {...fadeUp}
          className="font-display text-3xl sm:text-4xl text-center gradient-text mb-12"
        >
          Event Schedule
        </motion.h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet to-cyan md:-translate-x-1/2" />
          {[
            {
              time: "09:00 AM",
              title: "Registration & Check-in",
              desc: "Team verification and kit distribution",
            },
            { time: "09:30 AM", title: "Problem Reveal", desc: "Tracks and statements unlocked" },
            { time: "09:45 AM", title: "Hack Starts", desc: "Build, code, iterate" },
            { time: "01:00 PM", title: "Games Start", desc: "Fun activities and refuel" },
            { time: "02:30 PM", title: "Submissions Close", desc: "Final code/demo deadline" },
            { time: "03:30 PM", title: "Judging & Prizes", desc: "Expert panel evaluations and awards" },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative mb-8 md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right md:mr-auto" : "md:pl-12 md:ml-auto"}`}
            >
              <div
                className="absolute left-2 md:left-auto top-2 w-4 h-4 rounded-full bg-violet border-2 border-cyan glow"
                style={i % 2 === 0 ? { right: "-8px" } : { left: "-8px" }}
              />
              <div className="glass p-4 inline-block max-w-full">
                <span className="inline-block bg-amber/20 text-amber font-display text-sm px-3 py-1 rounded-full mb-2">
                  {item.time}
                </span>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROBLEM STATEMENTS */}
      <section className="py-20 px-4 max-w-4xl mx-auto relative">
        <motion.h2
          {...fadeUp}
          className="font-display text-3xl sm:text-4xl text-center gradient-text mb-8"
        >
          Problem Statements
        </motion.h2>
        <div className="text-center">
          <CountdownTimer target={COUNTDOWN_TARGET} onExpire={setExpired} />
          <div className="mt-8">
            {expired ? (
              pdfUrl ? (
                <button className="btn-primary" onClick={viewPdf}>
                  📄 View Problem Statement
                </button>
              ) : (
                <p className="text-muted">
                  Problem statements will be uploaded by the host shortly…
                </p>
              )
            ) : (
              <div>
                <p className="text-muted flex items-center justify-center gap-2">
                  <Lock size={16} /> Locked — unlocks July 16, 2026 at 9:30 AM IST
                </p>
                {pdfUrl && adminSession && (
                  <p className="text-xs text-success mt-2">
                    ✓ PDF already uploaded — will appear when timer ends
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setHostPwOpen(true)}
          className="absolute bottom-2 right-2 text-xs text-muted/50 hover:text-muted"
        >
          🔐 Host
        </button>
        <input
          ref={pdfInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={onPdfFile}
          disabled={uploading}
        />
      </section>

      {/* GALLERY */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.h2
          {...fadeUp}
          className="font-display text-3xl sm:text-4xl text-center gradient-text mb-10"
        >
          Gallery
        </motion.h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Past Hackathon", "Team Spirit", "Winners"].map((title, i) => (
            <TiltWrapper
              key={i}
              className="glass aspect-video relative overflow-hidden rounded-xl"
              maxTilt={6}
              scale={1.03}
            >
              {galleryImgs[i] ? (
                <img src={galleryImgs[i]!} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet to-cyan">
                  <div className="text-5xl mb-2">📸</div>
                  <div className="font-display">{title}</div>
                </div>
              )}
              {adminSession && (
                <>
                  <button
                    onClick={() => galleryRefs[i].current?.click()}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-violet flex items-center justify-center text-white hover:scale-110 transition"
                  >
                    <Plus size={16} />
                  </button>
                  <input
                    ref={galleryRefs[i]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onGalleryFile(i, e)}
                  />
                </>
              )}
            </TiltWrapper>
          ))}
        </div>
        {!adminSession && (
          <div className="text-center mt-6">
            <button
              onClick={() => setGalleryPwOpen(true)}
              className="text-xs text-muted/40 hover:text-muted"
            >
              Manage Gallery
            </button>
          </div>
        )}
      </section>

      <footer className="py-10 px-4 text-center text-muted text-sm border-t border-violet/20 mt-10">
        <p>© 2026 HACKSPIRIT. Organized by IEEE Student Branch Volunteers.</p>
        <button
          onClick={() => setAdminPwOpen(true)}
          className="text-xs text-muted/30 hover:text-muted/70 mt-2"
        >
          Admin Panel
        </button>
      </footer>

      <PasswordModal
        open={hostPwOpen}
        onClose={() => setHostPwOpen(false)}
        title="Host Upload"
        onSuccess={async () => {
          setHostPwOpen(false);
          if (pdfUrl) {
            if (confirm("A PDF is already published. Replace it?")) pdfInputRef.current?.click();
          } else pdfInputRef.current?.click();
        }}
      />
      <PasswordModal
        open={adminPwOpen}
        onClose={() => setAdminPwOpen(false)}
        title="Admin Login"
        onSuccess={() => {
          sessionStorage.setItem("hackspirit_admin_session", "true");
          setAdminAuth(true);
          setAdminPwOpen(false);
          navigate("/admin");
        }}
      />
      <PasswordModal
        open={galleryPwOpen}
        onClose={() => setGalleryPwOpen(false)}
        title="Gallery Admin"
        onSuccess={() => {
          sessionStorage.setItem("hackspirit_admin_session", "true");
          setAdminSession(true);
          setGalleryPwOpen(false);
          toast.success("Gallery edit unlocked");
        }}
      />
    </div>
  );
}