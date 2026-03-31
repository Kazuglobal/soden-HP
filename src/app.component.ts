import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CustomCursorComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      const data = this.getRouteData();
      this.applyMeta(data);
    });
  }

  private getRouteData(): {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    imageAlt?: string;
  } {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data ?? {};
  }

  private applyMeta(data: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    imageAlt?: string;
  }) {
    const title = data.title
      ?? 'SEIKEN株式会社 | 溶接工事・鉄鋼加工（横浜）';
    const description = data.description
      ?? '横浜を中心に溶接工事を行うSEIKEN株式会社。アーク溶接・半自動溶接・Tig溶接、鍛冶工事・鉄骨工事など鉄鋼のプロフェッショナルとして確かな技術で対応。';
    const keywords = data.keywords
      ?? 'SEIKEN,溶接工事,アーク溶接,半自動溶接,Tig溶接,鍛冶工事,鉄骨工事,鉄鋼加工,横浜';
    const image = data.image ?? '/logo.png';
    const imageAlt = data.imageAlt ?? 'SEIKEN株式会社のチーム';
    const canonicalUrl = this.getCanonicalUrl();
    const resolvedImage = this.resolveUrl(image);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'author', content: 'SEIKEN株式会社' });
    this.meta.updateTag({ property: 'og:locale', content: 'ja_JP' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'SEIKEN株式会社' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: resolvedImage });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: resolvedImage });
    this.meta.updateTag({ name: 'twitter:image:alt', content: imageAlt });

    if (canonicalUrl) {
      this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
      this.meta.updateTag({ name: 'twitter:url', content: canonicalUrl });
      this.updateCanonicalLinks(canonicalUrl);
      this.updateStructuredData({
        title,
        description,
        image: resolvedImage,
        url: canonicalUrl
      });
    }
  }

  private getCanonicalUrl(): string | undefined {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    return url.toString();
  }

  private resolveUrl(path: string): string {
    if (typeof window === 'undefined') {
      return path;
    }

    return new URL(path, window.location.origin).toString();
  }

  private updateCanonicalLinks(canonicalUrl: string) {
    this.setLinkTag('canonical', canonicalUrl);
    this.setLinkTag('alternate', canonicalUrl, { hreflang: 'ja-JP' });
    this.setLinkTag('alternate', canonicalUrl, { hreflang: 'x-default' });
  }

  private setLinkTag(rel: string, href: string, attributes: { hreflang?: string } = {}) {
    const selector = attributes.hreflang
      ? `link[rel="${rel}"][hreflang="${attributes.hreflang}"]`
      : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (attributes.hreflang) {
        link.setAttribute('hreflang', attributes.hreflang);
      }
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private updateStructuredData(data: {
    title: string;
    description: string;
    image: string;
    url: string;
  }) {
    const baseUrl = new URL('/', data.url).toString().replace(/\/$/, '');
    const organizationId = `${baseUrl}/#organization`;
    const websiteId = `${baseUrl}/#website`;
    const webpageId = `${data.url}#webpage`;

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LocalBusiness',
          '@id': organizationId,
          name: 'SEIKEN株式会社',
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          image: data.image,
          description: '横浜を中心に溶接工事を行うSEIKEN株式会社。アーク溶接・半自動溶接・Tig溶接、鍛冶工事・鉄骨工事など鉄鋼のプロフェッショナルとして確かな技術で対応。',
          telephone: '+81-178-25-2172',
          foundingDate: '1987',
          areaServed: '神奈川県',
          address: {
            '@type': 'PostalAddress',
            postalCode: '222-0023',
            addressRegion: '神奈川県',
            addressLocality: '横浜市港北区',
            streetAddress: '仲手原2丁目42-23-5',
            addressCountry: 'JP'
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '08:00',
              closes: '18:00'
            }
          ],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+81-178-25-2172',
              contactType: 'customer service',
              areaServed: 'JP',
              availableLanguage: ['Japanese']
            }
          ]
        },
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: baseUrl,
          name: 'SEIKEN株式会社',
          publisher: { '@id': organizationId },
          inLanguage: 'ja-JP'
        },
        {
          '@type': 'WebPage',
          '@id': webpageId,
          url: data.url,
          name: data.title,
          description: data.description,
          isPartOf: { '@id': websiteId },
          about: { '@id': organizationId },
          inLanguage: 'ja-JP',
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: data.image
          }
        }
      ]
    };

    this.upsertJsonLd('structured-data', structuredData);
  }

  private upsertJsonLd(id: string, data: unknown) {
    let script = this.document.head.querySelector<HTMLScriptElement>(`script#${id}`);
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
