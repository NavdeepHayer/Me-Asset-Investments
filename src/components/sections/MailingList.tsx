import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";
import { supabase } from "../../lib/supabase";

type FormStatus = "idle" | "loading" | "success" | "error";

export function MailingList() {
  const { contactForm } = siteContent;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !name || !subject || !message) return;

    setStatus("loading");
    setErrorMessage("");

    const { error } = await supabase
      .from("contact_submissions")
      .insert([{ name, email, subject, message }]);

    if (error) {
      setStatus("error");
      setErrorMessage(contactForm.errorMessage);
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className="section-spacing" data-mailing-section>
      <div className="container-editorial" data-mailing-content>
        <ScrollReveal>
          <p className="text-body-large text-center mb-16">
            {contactForm.headline}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={contactForm.namePlaceholder}
                required
                disabled={status === "loading" || status === "success"}
                className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white/90 placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors duration-300 disabled:opacity-40"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={contactForm.emailPlaceholder}
                required
                disabled={status === "loading" || status === "success"}
                className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white/90 placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors duration-300 disabled:opacity-40"
              />
            </div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={contactForm.subjectPlaceholder}
              required
              disabled={status === "loading" || status === "success"}
              className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white/90 placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors duration-300 disabled:opacity-40"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={contactForm.messagePlaceholder}
              required
              rows={4}
              disabled={status === "loading" || status === "success"}
              className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white/90 placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors duration-300 disabled:opacity-40 resize-none"
            />
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full py-3 text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white/90 border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "..." : contactForm.buttonText}
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
              {contactForm.successMessage}
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-red-400/70 mt-8 italic"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
