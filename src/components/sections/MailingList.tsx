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
    <section className="section-spacing-sm bg-neutral-100">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <h2 className="text-headline mb-4">{mailingList.headline}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-body text-neutral-600 mb-8 max-w-xl mx-auto">
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
              className="flex-1 px-4 py-3 border border-neutral-300 bg-white text-neutral-800 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="text-sm text-neutral-600 mt-4"
            >
              {mailingList.successMessage}
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-600 mt-4"
            >
              {mailingList.errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
