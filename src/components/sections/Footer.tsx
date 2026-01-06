import { siteContent } from "../../content/siteContent";

export function Footer() {
  const { footer } = siteContent;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 md:py-16 border-t border-white/10">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-white/50">
          {/* Copyright */}
          <div className="font-serif">
            &copy; {currentYear} {footer.copyright}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            {footer.legalLinks.map((link, index) => (
              <span key={link.name} className="flex items-center gap-6">
                <a
                  href={link.url}
                  className="hover:text-white transition-colors font-serif"
                >
                  {link.name}
                </a>
                {index < footer.legalLinks.length - 1 && (
                  <span className="text-white/20">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
