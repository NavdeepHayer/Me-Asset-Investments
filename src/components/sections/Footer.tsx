import { siteContent } from "../../content/siteContent";

export function Footer() {
  const { footer } = siteContent;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 md:py-16 border-t border-white/10">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Copyright */}
          <div className="text-caption">
            &copy; {currentYear} {footer.copyright}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {footer.socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="text-caption hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            {footer.legalLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="text-caption hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
