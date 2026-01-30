import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Header } from '../components/ui/Header';
import { Footer } from '../components/sections/Footer';

interface NewsItem {
  id: string;
  headline: string;
  date: string;
  excerpt: string | null;
  content: string | null;
  quote: string | null;
  cta_text: string | null;
  external_link: string | null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function NewsDetail() {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      // Get the news ID from the URL path
      const pathParts = window.location.pathname.split('/');
      const newsId = pathParts[pathParts.length - 1];

      if (!newsId) {
        setError('News article not found');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('news')
          .select('*')
          .eq('id', newsId)
          .eq('visible', true)
          .single();

        if (fetchError || !data) {
          setError('News article not found');
        } else {
          setNews(data);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news article');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2d382c]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-white/60">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-[#2d382c]">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <h1 className="text-2xl font-serif text-white/90 mb-4">Article Not Found</h1>
          <p className="text-white/60 mb-8">{error || 'The article you are looking for does not exist.'}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d382c]">
      <Header />

      <main className="section-spacing">
        <article className="container-editorial">
          {/* Back Link */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-12"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm tracking-wider">Back to Home</span>
          </a>

          {/* Date */}
          <p className="text-sm sm:text-base text-white/40 tracking-wider mb-6">
            {formatDate(news.date)}
          </p>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white/90 tracking-wide leading-tight mb-8 sm:mb-12">
            {news.headline}
          </h1>

          {/* Divider */}
          <div className="w-24 h-px bg-white/20 mb-8 sm:mb-12" />

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            {/* Excerpt as lead paragraph */}
            {news.excerpt && (
              <p className="text-lg sm:text-xl md:text-2xl text-white/70 font-light leading-relaxed mb-8">
                {news.excerpt}
              </p>
            )}

            {/* Main content */}
            {news.content && (
              <div
                className="news-content text-base sm:text-lg text-white/60 font-light leading-relaxed"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            )}

            {/* Quote */}
            {news.quote && (
              <blockquote className="border-l-2 border-white/30 pl-6 sm:pl-8 my-12">
                <p className="font-serif text-xl sm:text-2xl md:text-3xl text-white/70 italic leading-relaxed">
                  "{news.quote}"
                </p>
              </blockquote>
            )}

            {/* External link if provided */}
            {news.external_link && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <a
                  href={news.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white/90 transition-all duration-300"
                >
                  <span className="text-sm tracking-[0.15em] uppercase">
                    {news.cta_text || 'Read More'}
                  </span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />

      <style>{`
        .news-content p {
          margin-bottom: 1.5rem;
        }
        .news-content h1 {
          font-size: 1.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          margin: 2rem 0 1rem;
        }
        .news-content h2 {
          font-size: 1.5rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin: 1.75rem 0 1rem;
        }
        .news-content h3 {
          font-size: 1.25rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          margin: 1.5rem 0 0.75rem;
        }
        .news-content ul,
        .news-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .news-content li {
          margin-bottom: 0.5rem;
        }
        .news-content a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }
        .news-content a:hover {
          color: rgba(255, 255, 255, 1);
        }
        .news-content strong {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }
        .news-content em {
          font-style: italic;
        }
        .news-content img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem 0;
          border-radius: 4px;
        }
        .news-content iframe {
          max-width: 100%;
          width: 100%;
          height: 600px;
          margin: 1.5rem 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  );
}
