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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setName("");
    setEmail("");
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section className="section-spacing" data-mailing-section>
      <div className="container-editorial" data-mailing-content>
        <ScrollReveal>
          <p className="text-body-large text-center mb-16">
            {mailingList.headline}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-8">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mailingList.namePlaceholder}
              required
              disabled={status === "loading" || status === "success"}
              className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white/90 placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors duration-300 disabled:opacity-40"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mailingList.emailPlaceholder}
              required
              disabled={status === "loading" || status === "success"}
              className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white/90 placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors duration-300 disabled:opacity-40"
            />
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full py-3 text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white/90 border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "..." : mailingList.buttonText}
              </button>
            </div>
          </form>
        </ScrollReveal>
        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-white/50 mt-8 italic"
            >
              {mailingList.successMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
