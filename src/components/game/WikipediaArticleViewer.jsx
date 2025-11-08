import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

/**
 * Wikipedia Article Viewer Component
 * Displays Wikipedia article HTML content with link interception
 */
export const WikipediaArticleViewer = React.memo(function WikipediaArticleViewer({ html, onLinkClick, theme }) {
  const articleRef = useRef(null);
  const styleRef = useRef(null);

  useEffect(() => {
    if (!html || !articleRef.current) return;

    const container = articleRef.current;
    container.innerHTML = html;

    // Clean up DOM before styling
    const cleanupElements = () => {
      // Remove series boxes, navboxes, and similar templates
      const elementsToRemove = [
        '.navbox',
        '.vertical-navbox',
        '.horizontal-navbox',
        '.series-box',
        '.hatnote',
        '.dablink',
        '.rellink',
        '.infobox',
        '.sidebar',
        '.toc',
        '.tocnumber',
        '.mw-editsection',
        '.mw-indicators',
        '.reference',
        '.mw-references-wrap',
        '.reflist',
        '.mw-cite-backlink',
        '.noprint',
        '.mw-jump-link',
        '.mw-heading',
        'header',
        'nav',
        '.vector-header-container',
        '.vector-page-toolbar',
        '.vector-page-titlebar',
        '.vector-sticky-header',
        '.mw-search-container',
        '#searchform',
        '.cdx-search-input',
        '.vector-search-box',
        '#mw-head',
        '#mw-navigation',
        '.ambox',
        '.metadata',
        '.catlinks',
        '.mw-normal-catlinks',
        '.mw-hidden-catlinks',
        '.printfooter',
        '.mw-cite-backlink',
        '.mw-cite-up-arrow-backlink',
        '.mw-cite-bracket',
        '.mw-ref',
        '.mw-ref-reference',
        '[role="note"]',
        '.hatnote',
        '.dablink',
        '.rellink',
        '.vertical-navbox',
        '.horizontal-navbox',
        '.plainlinks',
        '.mw-parser-output > .mw-stack',
        '.mw-parser-output > .mw-stack-container',
        '.mw-parser-output > .mw-stack > .mw-stack',
        '.mw-parser-output > .mw-stack > .mw-stack-container',
      ];
      
      elementsToRemove.forEach(selector => {
        const elements = container.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      
      // Remove redirect notices (hatnotes) that appear at the top
      const hatnotes = container.querySelectorAll('.hatnote, .dablink, .rellink');
      hatnotes.forEach(el => el.remove());
      
      // Remove series navigation boxes and banners
      const seriesBoxes = container.querySelectorAll('[class*="series"], [class*="navbox"], [id*="series"], [id*="navbox"]');
      seriesBoxes.forEach(el => {
        const text = el.textContent.toLowerCase();
        if (text.includes('series') || text.includes('part of') || text.includes('navigation')) {
          el.remove();
        }
      });
      
      // Remove any divs or sections with blue backgrounds (often series banners) - simplified check
      const potentialBanners = container.querySelectorAll('div[style*="background"], section[style*="background"]');
      potentialBanners.forEach(el => {
        const styleAttr = el.getAttribute('style') || '';
        const text = el.textContent.toLowerCase();
        // Check for blue background colors in inline styles
        if ((styleAttr.includes('rgb(51, 102, 204)') || styleAttr.includes('#3366cc') || 
             styleAttr.includes('rgb(42, 75, 141)') || styleAttr.includes('background-color: #3366cc')) && 
            (text.includes('series') || text.includes('part of') || text.includes('article is part'))) {
          el.remove();
        }
      });
      
      // Remove citation needed markers but keep the text
      const citationNeeded = container.querySelectorAll('.citation-needed, .noprint');
      citationNeeded.forEach(el => el.remove());
      
      // Clean up empty paragraphs and divs
      const emptyElements = container.querySelectorAll('p:empty, div:empty');
      emptyElements.forEach(el => el.remove());
    };
    
    // Run initial cleanup after a small delay to ensure HTML is parsed
    setTimeout(() => {
      cleanupElements();
    }, 100);
    
    // Use MutationObserver to clean up dynamically added elements
    const observer = new MutationObserver(() => {
      // Debounce cleanup to avoid excessive calls
      clearTimeout(observer.timeout);
      observer.timeout = setTimeout(() => {
        cleanupElements();
      }, 200);
    });
    
    observer.observe(container, {
      childList: true,
      subtree: true
    });

    // Hide search bar and other Wikipedia UI elements
    const style = document.createElement('style');
    style.id = 'wikipedia-article-viewer-style';
    styleRef.current = style;
    style.textContent = `
      .wikipedia-article-viewer #mw-head,
      .wikipedia-article-viewer #mw-navigation,
      .wikipedia-article-viewer .mw-jump-link,
      .wikipedia-article-viewer .mw-editsection,
      .wikipedia-article-viewer .mw-indicators,
      .wikipedia-article-viewer .noprint,
      .wikipedia-article-viewer .navbox,
      .wikipedia-article-viewer .vertical-navbox,
      .wikipedia-article-viewer .horizontal-navbox,
      .wikipedia-article-viewer .infobox,
      .wikipedia-article-viewer .sidebar,
      .wikipedia-article-viewer .thumb,
      .wikipedia-article-viewer .toc,
      .wikipedia-article-viewer .mw-heading,
      .wikipedia-article-viewer header,
      .wikipedia-article-viewer nav,
      .wikipedia-article-viewer .vector-header-container,
      .wikipedia-article-viewer .vector-page-toolbar,
      .wikipedia-article-viewer .vector-page-titlebar,
      .wikipedia-article-viewer .vector-sticky-header,
      .wikipedia-article-viewer .mw-search-container,
      .wikipedia-article-viewer #searchform,
      .wikipedia-article-viewer .cdx-search-input,
      .wikipedia-article-viewer .vector-search-box,
      .wikipedia-article-viewer .hatnote,
      .wikipedia-article-viewer .dablink,
      .wikipedia-article-viewer .rellink,
      .wikipedia-article-viewer .ambox,
      .wikipedia-article-viewer .metadata,
      .wikipedia-article-viewer .catlinks,
      .wikipedia-article-viewer .mw-normal-catlinks,
      .wikipedia-article-viewer .mw-hidden-catlinks,
      .wikipedia-article-viewer .printfooter,
      .wikipedia-article-viewer .mw-cite-backlink,
      .wikipedia-article-viewer .mw-cite-up-arrow-backlink,
      .wikipedia-article-viewer .reference,
      .wikipedia-article-viewer .mw-references-wrap,
      .wikipedia-article-viewer .reflist,
      .wikipedia-article-viewer [role="note"],
      .wikipedia-article-viewer [class*="series-box"],
      .wikipedia-article-viewer [class*="navbox"] {
        display: none !important;
      }
      .wikipedia-article-viewer {
        ${theme === 'dark' 
          ? 'background: #1e293b; color: #e2e8f0;' 
          : theme === 'classic'
          ? 'background: #ffffff; color: #000000; border: 2px solid #000000;'
          : 'background: white; color: #1e293b;'}
        padding: 1rem;
        max-height: calc(100vh - 180px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      @media (min-width: 768px) {
        .wikipedia-article-viewer {
          padding: 1.5rem;
          max-height: calc(100vh - 200px);
        }
      }
      .wikipedia-article-viewer a {
        ${theme === 'dark'
          ? 'color: #60a5fa;'
          : theme === 'classic'
          ? 'color: #000000; text-decoration: underline;'
          : 'color: #2563eb;'}
        cursor: pointer;
        text-decoration: underline;
        touch-action: manipulation;
        min-height: 44px;
        display: inline-block;
        padding: 2px 0;
      }
      .wikipedia-article-viewer a:visited {
        ${theme === 'dark'
          ? 'color: #a78bfa;'
          : theme === 'classic'
          ? 'color: #000000;'
          : 'color: #7c3aed;'}
      }
      .wikipedia-article-viewer a:hover,
      .wikipedia-article-viewer a:active {
        ${theme === 'dark'
          ? 'color: #93c5fd;'
          : theme === 'classic'
          ? 'color: #ffffff; background-color: #000000;'
          : 'color: #3b82f6;'}
      }
      .wikipedia-article-viewer h1,
      .wikipedia-article-viewer h2,
      .wikipedia-article-viewer h3 {
        ${theme === 'dark' ? 'color: #f1f5f9;' : theme === 'classic' ? 'color: #000000; font-weight: bold;' : 'color: #0f172a;'}
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
      }
      @media (min-width: 768px) {
        .wikipedia-article-viewer h1,
        .wikipedia-article-viewer h2,
        .wikipedia-article-viewer h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .wikipedia-article-viewer h1 {
          font-size: 1.875rem;
        }
        .wikipedia-article-viewer h2 {
          font-size: 1.5rem;
        }
        .wikipedia-article-viewer h3 {
          font-size: 1.25rem;
        }
      }
      .wikipedia-article-viewer p {
        margin-bottom: 0.875rem;
        line-height: 1.6;
        font-size: 0.9375rem;
      }
      @media (min-width: 768px) {
        .wikipedia-article-viewer p {
          margin-bottom: 1rem;
          font-size: 1rem;
        }
      }
      .wikipedia-article-viewer img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin: 0.5rem 0;
      }
      .wikipedia-article-viewer ul,
      .wikipedia-article-viewer ol {
        margin: 0.75rem 0;
        padding-left: 1.5rem;
        line-height: 1.6;
      }
      .wikipedia-article-viewer li {
        margin: 0.25rem 0;
      }
      .wikipedia-article-viewer blockquote {
        margin: 1rem 0;
        padding-left: 1rem;
        border-left: 3px solid ${theme === 'dark' ? '#475569' : theme === 'classic' ? '#000000' : '#cbd5e1'};
        ${theme === 'dark' ? 'color: #cbd5e1;' : theme === 'classic' ? 'color: #000000;' : 'color: #475569;'}
      }
      .wikipedia-article-viewer table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }
      .wikipedia-article-viewer table th,
      .wikipedia-article-viewer table td {
        padding: 0.5rem;
        border: 1px solid ${theme === 'dark' ? '#475569' : theme === 'classic' ? '#000000' : '#e2e8f0'};
      }
      .wikipedia-article-viewer table th {
        ${theme === 'dark' ? 'background: #334155;' : theme === 'classic' ? 'background: #f5f5f0;' : 'background: #f1f5f9;'}
        font-weight: 600;
      }
      .wikipedia-article-viewer .mw-parser-output > *:first-child {
        margin-top: 0;
      }
      .wikipedia-article-viewer .mw-parser-output > h1:first-child {
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid ${theme === 'dark' ? '#475569' : theme === 'classic' ? '#000000' : '#e2e8f0'};
      }
    `;
    
    // Remove existing style if present
    const existingStyle = document.getElementById('wikipedia-article-viewer-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);

    // Intercept all link clicks
    const links = container.querySelectorAll('a[href]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const href = link.getAttribute('href');
        if (!href) return;

        // Extract article title from Wikipedia URL
        // Handle both /wiki/Article_Title and relative links
        let title = null;
        if (href.startsWith('/wiki/')) {
          title = decodeURIComponent(href.replace('/wiki/', ''));
        } else if (href.includes('wikipedia.org/wiki/')) {
          const match = href.match(/wiki\/([^?#]+)/);
          if (match) {
            title = decodeURIComponent(match[1]);
          }
        }

        // Only navigate if it's a valid article link (not external, not special pages)
        if (title && !title.startsWith('Special:') && !title.startsWith('File:') && !title.startsWith('Category:') && !title.startsWith('Template:') && !title.startsWith('Help:') && !title.startsWith('User:')) {
          // Replace underscores with spaces
          title = title.replace(/_/g, ' ');
          onLinkClick(title);
        }
      });
    });

    return () => {
      observer.disconnect();
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }
    };
  }, [html, onLinkClick, theme]);

  if (!html) {
    return (
      <div className={`flex items-center justify-center h-full p-4 md:p-8 ${
        theme === 'dark' ? 'text-gray-300' : 'text-slate-500'
      }`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm md:text-base">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={articleRef} 
      className="wikipedia-article-viewer"
      style={{ 
        maxHeight: 'calc(100vh - 180px)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    />
  );
});

