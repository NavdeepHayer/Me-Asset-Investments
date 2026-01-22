import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "../../content/siteContent";

export function Footer() {
  const { footer } = siteContent;
  const currentYear = new Date().getFullYear();
  const [showLegal, setShowLegal] = useState(false);

  return (
    <>
      <footer className="py-8 md:py-12">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-xs tracking-[0.15em] uppercase text-white/30">
            <div>
              &copy; {currentYear} {footer.copyright}
            </div>
            <button
              onClick={() => setShowLegal(true)}
              className="hover:text-white/60 transition-colors duration-300 text-left"
            >
              Terms & Privacy
            </button>
          </div>
        </div>
      </footer>

      {/* Terms & Privacy Modal */}
      <AnimatePresence>
        {showLegal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLegal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Terms & Privacy</h2>
                <button
                  onClick={() => setShowLegal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Terms of Use */}
                <section>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Terms of Use</h3>
                  <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                    <p>
                      By accessing and using this website, you accept and agree to be bound by these terms and conditions.
                      The information provided on this website is for general informational purposes only.
                    </p>
                    <p>
                      All content on this website, including text, graphics, logos, and images, is the property of
                      {footer.copyright} and is protected by applicable intellectual property laws.
                    </p>
                    <p>
                      This website does not constitute an offer to sell or a solicitation of an offer to buy any securities
                      or investment products. Any investment decisions should be made based on professional advice and
                      thorough due diligence.
                    </p>
                    <p>
                      We reserve the right to modify these terms at any time without prior notice. Continued use of the
                      website following any changes constitutes acceptance of those changes.
                    </p>
                  </div>
                </section>

                {/* Privacy Policy */}
                <section>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Privacy Policy</h3>
                  <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                    <p>
                      We are committed to protecting your privacy and personal information. This policy outlines how we
                      collect, use, and safeguard your data.
                    </p>
                    <p>
                      <strong className="text-white/90">Information We Collect:</strong> When you submit a contact form,
                      we collect your name, email address, and any message content you provide. We may also collect
                      anonymous usage data to improve our website.
                    </p>
                    <p>
                      <strong className="text-white/90">How We Use Your Information:</strong> We use the information you
                      provide solely to respond to your enquiries and communicate with you about our services. We do not
                      sell, trade, or share your personal information with third parties.
                    </p>
                    <p>
                      <strong className="text-white/90">Data Security:</strong> We implement appropriate technical and
                      organisational measures to protect your personal information against unauthorised access, alteration,
                      or destruction.
                    </p>
                    <p>
                      <strong className="text-white/90">Your Rights:</strong> You have the right to request access to,
                      correction of, or deletion of your personal data. To exercise these rights, please contact us using
                      the details provided on this website.
                    </p>
                  </div>
                </section>

                {/* Contact */}
                <section>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    If you have any questions about these terms or our privacy practices, please contact us at{" "}
                    <a
                      href={`mailto:${footer.contact.email}`}
                      className="text-white/90 hover:text-white underline"
                    >
                      {footer.contact.email}
                    </a>
                  </p>
                </section>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={() => setShowLegal(false)}
                  className="w-full py-3 text-sm font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
