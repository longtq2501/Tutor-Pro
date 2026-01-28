# SEO AUDIT CHECKLIST - Next.js + Spring Boot
## Comprehensive SEO Evaluation Guide for AI Agent

**Version**: 1.0  
**Last Updated**: January 2026  
**Target Stack**: Next.js Frontend + Spring Boot Backend  
**Purpose**: Đánh giá SEO compliance cho production-ready application

---

## 📋 HOW TO USE THIS CHECKLIST

### For AI Agent:
1. Read entire checklist
2. Scan Next.js codebase (frontend)
3. Scan Spring Boot codebase (backend) 
4. Mark each item: ✅ PASS | ⚠️ WARNING | ❌ FAIL
5. Generate comprehensive report with:
   - Executive Summary
   - Critical Issues (must fix)
   - Warnings (should fix)  
   - Code fix suggestions
   - Priority action items

### Scoring System:
- ✅ **PASS**: Đạt yêu cầu
- ⚠️ **WARNING**: Cần cải thiện
- ❌ **FAIL**: Vi phạm nghiêm trọng, phải fix ngay

---

## 1. TECHNICAL SEO - NEXT.JS FRONTEND ⭐⭐⭐⭐⭐

### 1.1 Rendering Strategy

**Check Files**: `app/layout.tsx`, `app/page.tsx`, `next.config.js`

#### ✅ Server-Side Rendering (SSR) / Static Generation (SSG)

```typescript
// ✅ GOOD: SSR for landing pages
export default async function Page() {
  const data = await fetch('...', { cache: 'force-cache' });
  return <div>{/* SEO content visible in HTML */}</div>;
}

// ❌ BAD: Client-only rendering
'use client';
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('...').then(setData) }, []);
  return <div>{data}</div>; // Googlebot sees empty div
}
```

**Check**:
- [ ] Landing page, blog posts use SSR/SSG
- [ ] Critical content trong initial HTML (view source)
- [ ] Dashboard/private pages can use CSR

**Validation**:
```bash
npm run build
# Look for: ○ (Static), ● (SSG), λ (Server)
```

---

#### ✅ Dynamic Import cho Heavy Components

```typescript
// ✅ GOOD:
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(
  () => import('@/components/ThreeScene'),
  { ssr: false, loading: () => <Placeholder /> }
);

// ❌ BAD:
import ThreeScene from '@/components/ThreeScene';
```

**Check**:
- [ ] Heavy libraries (Three.js, charts) lazy loaded
- [ ] Non-critical components use dynamic import

---

### 1.2 Metadata & SEO Tags ⭐⭐⭐⭐⭐

**Check Files**: `app/layout.tsx`, `app/*/page.tsx`

#### ✅ Next.js Metadata API

```typescript
// ✅ GOOD: app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Tutor Pro - Quản Lý Giáo Dục',
    template: '%s | Tutor Pro'
  },
  description: 'Nền tảng quản lý giáo dục hàng đầu Việt Nam',
  keywords: ['quản lý giáo dục', 'gia sư', 'học sinh'],
  authors: [{ name: 'Tutor Pro Team' }],
  creator: 'Tutor Pro',
  
  metadataBase: new URL('https://tutorpro.vn'),
  
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://tutorpro.vn',
    siteName: 'Tutor Pro',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Tutor Pro'
    }]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Tutor Pro',
    description: '...',
    images: ['/twitter-image.png']
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  
  verification: {
    google: 'google-site-verification-code'
  }
};
```

**Check**:
- [ ] Uses Metadata API (not <Head> component)
- [ ] Has OpenGraph tags
- [ ] Has Twitter Card tags
- [ ] Robots meta configured
- [ ] Google verification tag present

---

#### ✅ Dynamic Metadata

```typescript
// ✅ GOOD: app/blog/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      publishedTime: post.publishedAt,
      authors: [post.author]
    },
    alternates: {
      canonical: `https://tutorpro.vn/blog/${params.slug}`
    }
  };
}
```

**Check**:
- [ ] Dynamic pages có generateMetadata
- [ ] Canonical URLs set correctly
- [ ] Unique titles/descriptions per page

---

#### ✅ Structured Data (JSON-LD)

```typescript
// ✅ GOOD: Organization Schema
export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tutor Pro',
    url: 'https://tutorpro.vn',
    logo: 'https://tutorpro.vn/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-xxx-xxx-xxx',
      contactType: 'customer service'
    }
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Content */}
    </>
  );
}
```

**Check**:
- [ ] Organization schema on homepage
- [ ] Article/BlogPosting schema on blog
- [ ] BreadcrumbList where applicable
- [ ] Validate with Google Rich Results Test

---

### 1.3 Performance & Core Web Vitals ⭐⭐⭐⭐⭐

#### ✅ Image Optimization

**Check Files**: All components with images

```typescript
// ✅ GOOD:
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Tutor Pro Dashboard"
  width={1920}
  height={1080}
  priority // For hero images
  placeholder="blur"
/>

// ❌ BAD:
<img src="/hero.jpg" alt="..." />
```

**next.config.js**:
```javascript
module.exports = {
  images: {
    domains: ['cdn.tutorpro.vn'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  }
};
```

**Check**:
- [ ] Uses Next.js Image component (not <img>)
- [ ] Hero images have priority prop
- [ ] Below-fold images lazy load
- [ ] Image optimization configured

---

#### ✅ Font Optimization

```typescript
// ✅ GOOD: app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**Check**:
- [ ] Uses next/font (not CDN)
- [ ] display: 'swap' to prevent FOIT
- [ ] Only loads needed weights
- [ ] Vietnamese subset if needed

---

#### ✅ Bundle Size & Code Splitting

```bash
# Check output:
npm run build

# Target:
First Load JS: < 200 KB ✅
First Load JS: < 300 KB ⚠️
First Load JS: > 300 KB ❌
```

**Check**:
- [ ] First Load JS < 200KB (good) or < 300KB (acceptable)
- [ ] Heavy components dynamically imported
- [ ] No large shared bundles
- [ ] Tree shaking enabled

**Bundle Analysis**:
```bash
npm install --save-dev @next/bundle-analyzer
ANALYZE=true npm run build
```

**Check**:
- [ ] No duplicate dependencies
- [ ] Large libraries lazy loaded
- [ ] Named imports (not import *)

---

#### ✅ Script Loading

```typescript
// ✅ GOOD:
import Script from 'next/script';

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>

<Script
  src="https://widget.example.com/script.js"
  strategy="lazyOnload"
/>
```

**Check**:
- [ ] Uses Next.js Script component
- [ ] Analytics: afterInteractive
- [ ] Non-critical scripts: lazyOnload
- [ ] No blocking scripts

---

### 1.4 Mobile Optimization ⭐⭐⭐⭐⭐

#### ✅ Responsive Design

```typescript
// ✅ GOOD: Viewport meta
export const metadata: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5, // Allow zoom for accessibility
    userScalable: true
  }
};
```

**Check**:
- [ ] Viewport meta tag correct
- [ ] Mobile-first CSS
- [ ] Touch targets ≥ 44x44px
- [ ] No horizontal scroll
- [ ] Tested on real devices

---

#### ✅ Mobile Performance

```bash
# Lighthouse mobile audit
Performance: > 90 ✅
Accessibility: > 90 ✅
SEO: > 90 ✅
```

**Check**:
- [ ] Mobile Lighthouse > 90
- [ ] Reduced motion support
- [ ] Mobile-specific optimizations

---

### 1.5 Accessibility ⭐⭐⭐⭐

#### ✅ Semantic HTML

```typescript
// ✅ GOOD:
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>...</footer>

// ❌ BAD:
<div class="header">
  <div class="nav">...</div>
</div>
```

**Check**:
- [ ] Uses semantic HTML5 tags
- [ ] Proper heading hierarchy (h1→h2→h3)
- [ ] Buttons vs Links used correctly
- [ ] Forms have labels

---

#### ✅ ARIA Attributes

```typescript
// ✅ GOOD:
<button aria-label="Close modal" onClick={close}>
  <XIcon />
</button>

<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>

{hasError && (
  <span id="email-error" role="alert">
    Invalid email
  </span>
)}
```

**Check**:
- [ ] Interactive elements have aria-labels
- [ ] Form errors with aria-invalid
- [ ] Live regions for dynamic content
- [ ] Modal focus trapping

---

#### ✅ Keyboard Navigation

**Check**:
- [ ] All interactive elements keyboard accessible
- [ ] Visible focus indicators
- [ ] Logical tab order
- [ ] Esc closes modals

**Test**: Navigate entire site with keyboard only

---

### 1.6 URL Structure & Routing ⭐⭐⭐⭐

#### ✅ Clean URLs

```bash
# ✅ GOOD:
/blog/how-to-manage-students
/courses/math-grade-10
/about

# ❌ BAD:
/blog?id=123
/page.html
/TutorManagement
```

**Check**:
- [ ] Clean, readable URLs
- [ ] Lowercase with hyphens
- [ ] Logical hierarchy
- [ ] No trailing slashes (or consistent)

---

#### ✅ Redirects

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true, // 301
      }
    ];
  }
};
```

**Check**:
- [ ] 301 redirects for moved content
- [ ] 302 for temporary redirects
- [ ] No redirect chains

---

### 1.7 Sitemap & Robots ⭐⭐⭐⭐⭐

#### ✅ Dynamic Sitemap

```typescript
// ✅ GOOD: app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  
  return [
    {
      url: 'https://tutorpro.vn',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    ...posts.map(post => ({
      url: `https://tutorpro.vn/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8
    }))
  ];
}
```

**Check**:
- [ ] Dynamic sitemap generation
- [ ] Accessible at /sitemap.xml
- [ ] Submitted to Google Search Console
- [ ] All important pages included

---

#### ✅ Robots.txt

```typescript
// ✅ GOOD: app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/']
    },
    sitemap: 'https://tutorpro.vn/sitemap.xml'
  };
}
```

**Check**:
- [ ] Robots.txt configured
- [ ] Doesn't block important pages
- [ ] Sitemap URL included
- [ ] Accessible at /robots.txt

---

## 2. BACKEND SEO - SPRING BOOT API ⭐⭐⭐⭐

### 2.1 API Response Headers

#### ✅ Cache Headers

```java
// ✅ GOOD:
@GetMapping("/api/posts/{slug}")
public ResponseEntity<Post> getPost(@PathVariable String slug) {
    Post post = postService.findBySlug(slug);
    
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS)
            .cachePublic()
            .mustRevalidate())
        .body(post);
}
```

**Check**:
- [ ] Appropriate Cache-Control headers
- [ ] ETag support for efficient caching
- [ ] Static content: long cache
- [ ] Dynamic content: short cache or no-store

---

#### ✅ CORS Headers

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://tutorpro.vn")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .maxAge(3600);
    }
}
```

**Check**:
- [ ] CORS configured for Next.js domain
- [ ] Not too permissive (no allowedOrigins("*"))
- [ ] Credentials handling correct

---

### 2.2 API Performance

#### ✅ Response Times

```bash
# Target:
p50: < 100ms ✅
p95: < 200ms ✅
p99: < 500ms ✅
```

**Check**:
- [ ] API response times < 200ms (p95)
- [ ] Database queries optimized
- [ ] Pagination implemented
- [ ] N+1 query problem avoided
- [ ] Caching layer (Redis/Caffeine)

---

#### ✅ Database Optimization

```java
// ✅ GOOD: Pagination
@GetMapping("/api/posts")
public Page<Post> getPosts(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size
) {
    return postService.findAll(PageRequest.of(page, size));
}

// ✅ GOOD: Eager loading
@Query("SELECT p FROM Post p LEFT JOIN FETCH p.author")
List<Post> findAllWithAuthor();

// ❌ BAD: No pagination, N+1 queries
```

**Check**:
- [ ] Pagination for large datasets
- [ ] Database indexes on frequently queried columns
- [ ] Eager loading to avoid N+1
- [ ] Query optimization

---

### 2.3 SEO-Specific Endpoints

#### ✅ Sitemap API

```java
@RestController
@RequestMapping("/api")
public class SitemapController {
    
    @GetMapping(value = "/sitemap", produces = MediaType.APPLICATION_XML_VALUE)
    @Cacheable("sitemap")
    public String generateSitemap() {
        List<Post> posts = postService.findAllPublished();
        
        StringBuilder sitemap = new StringBuilder();
        sitemap.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sitemap.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
        
        for (Post post : posts) {
            sitemap.append("<url>");
            sitemap.append("<loc>https://tutorpro.vn/blog/")
                   .append(post.getSlug()).append("</loc>");
            sitemap.append("<lastmod>")
                   .append(post.getUpdatedAt().format(DateTimeFormatter.ISO_DATE))
                   .append("</lastmod>");
            sitemap.append("</url>");
        }
        
        sitemap.append("</urlset>");
        return sitemap.toString();
    }
}
```

**Check**:
- [ ] Sitemap generation API
- [ ] Cached to reduce load
- [ ] All public pages included
- [ ] Valid XML format

---

### 2.4 Security Headers

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.headers()
            .xssProtection().block(true)
            .and()
            .contentTypeOptions()
            .and()
            .frameOptions().deny()
            .and()
            .httpStrictTransportSecurity()
                .includeSubDomains(true)
                .maxAgeInSeconds(31536000);
    }
}
```

**Check**:
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Strict-Transport-Security header

---

## 3. INFRASTRUCTURE ⭐⭐⭐⭐⭐

### 3.1 HTTPS & SSL

**Check**:
- [ ] HTTPS enabled
- [ ] Valid SSL certificate (A+ rating)
- [ ] HTTP → HTTPS redirect
- [ ] WWW → non-WWW redirect (or vice versa, consistent)

**Test**: https://www.ssllabs.com/ssltest/

---

### 3.2 CDN & Caching

**Check**:
- [ ] CDN configured (Cloudflare/Vercel/CloudFront)
- [ ] Static assets cached (max-age=31536000)
- [ ] Image optimization through CDN
- [ ] Gzip/Brotli compression enabled

**Test**:
```bash
curl -I https://tutorpro.vn
# Look for: cf-ray, x-vercel-cache, x-amz-cf-id
```

---

### 3.3 Server Response Codes

**Check**:
- [ ] Valid pages: 200 OK
- [ ] Not found: 404 (not soft 404)
- [ ] Redirects: 301/302
- [ ] Server errors: 500 (not 200 with error message)
- [ ] Custom error pages exist

---

## 4. MONITORING ⭐⭐⭐⭐

### 4.1 Google Search Console

**Check**:
- [ ] Site verified
- [ ] Sitemap submitted
- [ ] No critical Coverage errors
- [ ] No Mobile Usability issues
- [ ] Core Web Vitals: Good URLs > 75%

---

### 4.2 Analytics

```typescript
// ✅ GOOD: GA4
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

**Check**:
- [ ] Google Analytics 4 configured
- [ ] Doesn't block rendering (afterInteractive)
- [ ] Custom event tracking (optional)
- [ ] Privacy compliant

---

### 4.3 Performance Monitoring

**Check**:
- [ ] Core Web Vitals tracking
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Uptime monitoring
- [ ] API response time monitoring

---

## 5. CONTENT & ON-PAGE SEO ⭐⭐⭐⭐⭐

### 5.1 Content Quality

**Check**:
- [ ] Unique, valuable content (not thin)
- [ ] No duplicate content
- [ ] Regular updates
- [ ] Content > 300 words per page (minimum)

---

### 5.2 Keyword Optimization

**Check**:
- [ ] Keywords in titles
- [ ] Keywords in meta descriptions
- [ ] Keywords in H1/H2 tags
- [ ] Keywords in content naturally
- [ ] No keyword stuffing
- [ ] Long-tail keywords targeted

---

### 5.3 Internal Linking

**Check**:
- [ ] Strategic internal links
- [ ] Breadcrumbs implemented
- [ ] No broken internal links
- [ ] Footer navigation links
- [ ] Related content links

---

## 6. TECHNICAL CHECKS ⭐⭐⭐⭐⭐

### 6.1 Lighthouse Audit

```bash
npx lighthouse https://tutorpro.vn --view

Target scores:
Performance: > 90 ✅
Accessibility: > 90 ✅
Best Practices: > 90 ✅
SEO: > 90 ✅
```

**Check**:
- [ ] All scores > 90 (or > 80 minimum)
- [ ] No critical errors
- [ ] Most warnings addressed

---

### 6.2 Core Web Vitals

```bash
# PageSpeed Insights
LCP: < 2.5s ✅
FID/INP: < 200ms ✅
CLS: < 0.1 ✅
```

**Check**:
- [ ] LCP < 2.5s (mobile + desktop)
- [ ] FID < 200ms (mobile + desktop)
- [ ] CLS < 0.1 (mobile + desktop)
- [ ] Field data shows "Good" (green)

**Test**: https://pagespeed.web.dev/

---

### 6.3 Mobile-Friendly Test

**Check**:
- [ ] Passes mobile-friendly test
- [ ] Text not too small
- [ ] Content fits screen
- [ ] Touch elements properly spaced

**Test**: https://search.google.com/test/mobile-friendly

---

### 6.4 Rich Results Test

**Check**:
- [ ] Structured data valid
- [ ] No errors (warnings okay)
- [ ] Rich results eligible

**Test**: https://search.google.com/test/rich-results

---

## 7. SPECIFIC FOR 3D LANDING PAGE 🎨

### 7.1 Three.js Optimization

**Check**:
- [ ] Three.js lazy loaded (dynamic import)
- [ ] WebGL fallback for unsupported browsers
- [ ] Mobile: reduced complexity or disabled
- [ ] Proper cleanup (dispose geometry/material)
- [ ] FPS > 30 on mobile
- [ ] Bundle size impact acceptable

```typescript
// ✅ GOOD:
const ThreeScene = dynamic(
  () => import('@/components/ThreeScene'),
  { ssr: false, loading: () => <Placeholder /> }
);

// Check in component:
useEffect(() => {
  const isMobile = window.innerWidth < 768;
  const complexity = isMobile ? 'low' : 'high';
  
  // Initialize with appropriate complexity
  
  return () => {
    // Cleanup
    scene.clear();
    renderer.dispose();
  };
}, []);
```

**Check**:
- [ ] Doesn't block initial page load
- [ ] LCP still < 2.5s with 3D
- [ ] Mobile performance acceptable
- [ ] Static fallback available

---

## 8. BEST PRACTICES

### 8.1 Code Quality

**Check**:
- [ ] No console.log in production
- [ ] Environment variables properly managed
- [ ] TypeScript strict mode enabled
- [ ] No sensitive data in client code
- [ ] Proper error boundaries

---

### 8.2 Security

**Check**:
- [ ] .gitignore configured correctly
- [ ] No secrets in git history
- [ ] API keys in environment variables
- [ ] CSRF protection enabled
- [ ] Input validation on forms

---

## 📊 SCORING SUMMARY

Calculate final score:

```
Total Score = (Sum of passed checks) / (Total checks) × 100

Score Interpretation:
90-100: Excellent ✅
80-89:  Good ⚠️
70-79:  Needs Improvement ⚠️
< 70:   Critical Issues ❌
```

**Category Weights**:
- Technical SEO (Next.js): 25%
- Performance & Core Web Vitals: 20%
- Backend SEO: 15%
- Infrastructure: 15%
- Content & On-Page: 10%
- Monitoring: 10%
- Accessibility: 5%

---

## 🚀 OUTPUT REPORT FORMAT

```markdown
# SEO AUDIT REPORT - Tutor Pro

**Date**: [Date]
**Overall Score**: [Score]/100
**Status**: [Excellent/Good/Needs Improvement/Critical]

## Executive Summary

### Critical Issues (Must Fix):
1. [Issue] - Priority: HIGH
2. [Issue] - Priority: HIGH

### Warnings (Should Fix):
1. [Warning] - Priority: MEDIUM
2. [Warning] - Priority: MEDIUM

### Strengths:
1. [Strength]
2. [Strength]

## Detailed Findings

### 1. Technical SEO (Score: X/100)
- Rendering: [✅/⚠️/❌] [Details]
- Metadata: [✅/⚠️/❌] [Details]
- Performance: [✅/⚠️/❌] [Details]

### 2. Backend SEO (Score: X/100)
[Details...]

## Priority Actions

### Week 1 (Critical):
1. [Action] - Fix [Issue]
   ```typescript
   // Code fix suggestion
   ```

### Month 1 (Important):
1. [Action]

### Month 3 (Nice to Have):
1. [Action]

## Code Fix Examples

### Fix 1: [Issue Name]
**Current Code**:
```typescript
// Bad code
```

**Suggested Fix**:
```typescript
// Good code
```

**Impact**: [Expected improvement]

## Monitoring Recommendations

1. Setup Google Search Console
2. Implement Core Web Vitals tracking
3. Monthly SEO audits
4. Track keyword rankings

## Resources & Tools

- Lighthouse: https://developers.google.com/web/tools/lighthouse
- PageSpeed Insights: https://pagespeed.web.dev/
- Search Console: https://search.google.com/search-console
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Rich Results Test: https://search.google.com/test/rich-results
```

---

## ✅ FINAL CHECKLIST FOR AI AGENT

Before submitting report:

- [ ] All sections reviewed
- [ ] Score calculated accurately
- [ ] Critical issues identified
- [ ] Code fixes provided for major issues
- [ ] Priority levels assigned (HIGH/MEDIUM/LOW)
- [ ] Realistic timeline for fixes
- [ ] Resources & tools listed
- [ ] Report formatted clearly

---

**End of Checklist**

*Version 1.0 - January 2026*  
*For questions or updates, refer to latest SEO best practices from Google*