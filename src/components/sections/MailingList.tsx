import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

type FormStatus = "idle" | "loading" | "success" | "error";

export function MailingList() {
  const { mailingList } = siteContent;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setStatus("loading");

    // Simulate API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, always succeed
    setStatus("success");
    setEmail("");
    setName("");

    // Reset after a few seconds
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section className="section-spacing">
      <div className="container-editorial">
        <ScrollReveal>
          <h2 className="text-headline mb-12 text-center uppercase tracking-wider">
            {mailingList.headline}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-8">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={mailingList.namePlaceholder}
                required
                disabled={status === "loading" || status === "success"}
                className="w-full bg-transparent border-b border-white/40 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors disabled:opacity-50 font-serif"
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mailingList.emailPlaceholder}
                required
                disabled={status === "loading" || status === "success"}
                className="w-full bg-transparent border-b border-white/40 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors disabled:opacity-50 font-serif"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full py-4 bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-serif tracking-wider"
              >
                {status === "loading" ? "..." : mailingList.buttonText}
              </button>
            </div>
          </form>
        </ScrollReveal>
        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-caption mt-6"
            >
              {mailingList.successMessage}
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-sm text-red-300 mt-6"
            >
              {mailingList.errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
