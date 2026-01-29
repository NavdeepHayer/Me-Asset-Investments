import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { supabase } from "../../lib/supabase";

interface NewsItem {
  id: string;
  headline: string;
  date: string;
  excerpt: string | null;
  content: string | null;
  quote: string | null;
  cta_text: string | null;
  external_link: string | null;
  display_order: number;
  visible: boolean;
}

interface NewsCardProps {
  item: NewsItem;
  index: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function NewsCard({ item, index }: NewsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.5"],
  });

  // Alternate animation direction on mobile
  const isOddIndex = index % 2 === 1;
  const initialX = isMobile ? (isOddIndex ? 30 : -30) : 0;

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [initialX, 0]);

  // Determine the link - either external or internal news page
  const linkUrl = item.external_link || `/news/${item.id}`;
  const ctaText = item.cta_text || 'Read More';

  return (
    <motion.div
      ref={ref}
      className="h-full"
      style={{ opacity, x }}
    >
      <div className="group h-full border border-white/10 hover:border-white/25 transition-all duration-500 p-6 sm:p-8 flex flex-col">
        {/* Date */}
        <p className="text-sm text-white/40 tracking-wider mb-4">
          {formatDate(item.date)}
        </p>

        {/* Headline */}
        <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-white/90 mb-4 tracking-wide leading-tight">
          {item.headline}
        </h3>

        {/* Excerpt */}
        {item.excerpt && (
          <p className="text-base sm:text-lg text-white/60 font-light leading-relaxed mb-4 flex-grow">
            {item.excerpt}
          </p>
        )}

        {/* Quote */}
        {item.quote && (
          <blockquote className="border-l-2 border-white/20 pl-4 my-4">
            <p className="font-serif text-base sm:text-lg text-white/50 italic">
              "{item.quote}"
            </p>
          </blockquote>
        )}

        {/* CTA Link */}
        <div className="mt-auto pt-4">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white/90 transition-colors duration-300 group/link"
          >
            <span className="text-sm tracking-[0.15em] uppercase">{ctaText}</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function News() {
  const initialCount = 6;
  const [showAll, setShowAll] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('visible', true)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching news:', error);
        } else if (data) {
          setNews(data);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const visibleNews = showAll ? news : news.slice(0, initialCount);
  const hasMoreNews = news.length > initialCount;

  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headingProgress } = useScroll({
    target: headingRef,
    offset: ["start 0.85", "start 0.5"],
  });
  const headingOpacity = useTransform(headingProgress, [0, 1], [0, 1]);
  const headingY = useTransform(headingProgress, [0, 1], [20, 0]);

  // Don't render section if no news items
  if (!loading && news.length === 0) {
    return null;
  }

  return (
    <section className="section-spacing" data-news-section>
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          ref={headingRef}
          style={{ opacity: headingOpacity, y: headingY }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          <p className="text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-6">
            Latest Updates
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white/90 tracking-wide">
            News & Insights
          </h2>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/40">Loading news...</div>
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {visibleNews.map((item, index) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Show More / Show Less Button */}
        {hasMoreNews && (
          <div className="mt-12 sm:mt-16 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 hover:border-white/40 text-white/70 hover:text-white/90 transition-all duration-300 tracking-[0.2em] uppercase text-sm"
            >
              <span>{showAll ? "Show Less" : "Show More News"}</span>
              <motion.svg
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </button>
            {!showAll && (
              <p className="mt-4 text-sm text-white/30">
                Showing {visibleNews.length} of {news.length} articles
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
