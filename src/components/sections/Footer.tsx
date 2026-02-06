import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { siteContent } from "../../content/siteContent";
import { supabase } from "../../lib/supabase";

const FALLBACK_TERMS = `
<p>By accessing and using this website, you accept and agree to be bound by these terms and conditions. The information provided on this website is for general informational purposes only.</p>
<p>All content on this website, including text, graphics, logos, and images, is the property of ME Asset Investments and is protected by applicable intellectual property laws.</p>
<p>This website does not constitute an offer to sell or a solicitation of an offer to buy any securities or investment products. Any investment decisions should be made based on professional advice and thorough due diligence.</p>
<p>We reserve the right to modify these terms at any time without prior notice. Continued use of the website following any changes constitutes acceptance of those changes.</p>
`;

const FALLBACK_PRIVACY = `
<p>We are committed to protecting your privacy and personal information. This policy outlines how we collect, use, and safeguard your data.</p>
<p><strong>Information We Collect:</strong> When you submit a contact form, we collect your name, email address, and any message content you provide. We may also collect anonymous usage data to improve our website.</p>
<p><strong>How We Use Your Information:</strong> We use the information you provide solely to respond to your enquiries and communicate with you about our services. We do not sell, trade, or share your personal information with third parties.</p>
<p><strong>Data Security:</strong> We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, or destruction.</p>
<p><strong>Your Rights:</strong> You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, please contact us using the details provided on this website.</p>
`;

export function Footer() {
  const { footer } = siteContent;
  const currentYear = new Date().getFullYear();
  const [showLegal, setShowLegal] = useState(false);
  const [termsContent, setTermsContent] = useState(FALLBACK_TERMS);
  const [privacyContent, setPrivacyContent] = useState(FALLBACK_PRIVACY);

  useEffect(() => {
    const fetchLegalContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('key, value')
        .in('key', ['terms_of_use', 'privacy_policy']);

      if (!error && data) {
        data.forEach(item => {
          if (item.key === 'terms_of_use' && item.value) {
            setTermsContent(item.value);
          } else if (item.key === 'privacy_policy' && item.value) {
            setPrivacyContent(item.value);
          }
        });
      }
    };

    fetchLegalContent();
  }, []);

  return (
    <>
      <footer className="py-6 md:py-8">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-xs tracking-[0.15em] uppercase text-white/30">
            <div>
              &copy; {currentYear} {footer.copyright}
            </div>
            <address className="not-italic leading-relaxed">
              {footer.address.line1}<br />
              {footer.address.city}<br />
              {footer.address.postcode}
            </address>
            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/company/me-asset-management"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/60 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <button
                onClick={() => setShowLegal(true)}
                className="hover:text-white/60 transition-colors duration-300 text-left"
              >
                Terms & Privacy
              </button>
            </div>
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
                  <div
                    className="legal-content text-sm text-white/70 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(termsContent) }}
                  />
                </section>

                {/* Privacy Policy */}
                <section>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Privacy Policy</h3>
                  <div
                    className="legal-content text-sm text-white/70 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(privacyContent) }}
                  />
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
