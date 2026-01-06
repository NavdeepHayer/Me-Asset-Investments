import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

type FormStatus = "idle" | "loading" | "success" | "error";

export function MailingList() {
  const { mailingList } = siteContent;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, always succeed
    setStatus("success");
    setEmail("");

    // Reset after a few seconds
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section className="section-spacing-sm bg-white/5 backdrop-blur-sm">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <h2 className="text-headline mb-4 text-white">{mailingList.headline}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-body text-white/70 mb-8 max-w-xl mx-auto">
            {mailingList.description}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mailingList.placeholder}
              required
              disabled={status === "loading" || status === "success"}
              className="flex-1 px-4 py-3 border border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-8 py-3 bg-white text-neutral-900 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "..." : mailingList.buttonText}
            </button>
          </form>
        </ScrollReveal>
        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-white/70 mt-4"
            >
              {mailingList.successMessage}
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-400 mt-4"
            >
              {mailingList.errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
