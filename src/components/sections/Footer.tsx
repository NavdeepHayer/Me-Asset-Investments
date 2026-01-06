import { siteContent } from "../../content/siteContent";

export function Footer() {
  const { footer } = siteContent;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 md:py-12 bg-[#2C3E50]">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-white/60">
          {/* Copyright */}
          <div>
            &copy; {currentYear} {footer.copyright}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4">
            {footer.legalLinks.map((link, index) => (
              <span key={link.name} className="flex items-center gap-4">
                <a
                  href={link.url}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </a>
                {index < footer.legalLinks.length - 1 && (
                  <span className="text-white/30">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
