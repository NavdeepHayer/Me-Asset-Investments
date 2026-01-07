import { siteContent } from "../../content/siteContent";

export function Footer() {
  const { footer } = siteContent;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 md:py-20">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-xs tracking-[0.15em] uppercase text-white/30">
          <div>
            &copy; {currentYear} {footer.copyright}
          </div>
          <div className="flex items-center gap-8">
            {footer.legalLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="hover:text-white/60 transition-colors duration-300"
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
