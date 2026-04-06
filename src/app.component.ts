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
      ?? '株式会社創電工業 | 電気設備工事・設計施工（青森県八戸市）';
    const description = data.description
      ?? '青森県八戸市の株式会社創電工業。電気設備工事・電気通信工事・消防設備・空調設備・物流システムの設計施工から保守管理まで対応。1987年創業の実績。';
    const keywords = data.keywords
      ?? '創電工業,電気工事,電気設備,電気通信工事,消防設備,空調設備,物流システム,設計施工,保守管理,八戸,青森';
    const image = data.image ?? '/images/companyinfo.jpg';
    const imageAlt = data.imageAlt ?? '株式会社創電工業のチーム';
    const canonicalUrl = this.getCanonicalUrl();
    const resolvedImage = this.resolveUrl(image);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'author', content: '株式会社創電工業' });
    this.meta.updateTag({ property: 'og:locale', content: 'ja_JP' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: '株式会社創電工業' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: resolvedImage });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
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
          '@type': ['LocalBusiness', 'ElectricalContractor'],
          '@id': organizationId,
          name: '株式会社創電工業',
          alternateName: 'Soden Industry Co., Ltd.',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512
          },
          image: data.image,
          description: '青森県八戸市の株式会社創電工業。電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工から保守管理まで対応。1987年創業、地域密着38年の実績と信頼。',
          telephone: '+81-178-25-2172',
          faxNumber: '+81-178-25-2171',
          foundingDate: '1987',
          areaServed: [
            { '@type': 'AdministrativeArea', name: '青森県' },
            { '@type': 'City', name: '八戸市' },
            { '@type': 'City', name: '三沢市' },
            { '@type': 'City', name: 'おいらせ町' },
            { '@type': 'City', name: '南部町' },
            { '@type': 'City', name: '五戸町' }
          ],
          serviceArea: {
            '@type': 'GeoCircle',
            geoMidpoint: {
              '@type': 'GeoCoordinates',
              latitude: 40.5122,
              longitude: 141.4883
            },
            geoRadius: '50000'
          },
          address: {
            '@type': 'PostalAddress',
            postalCode: '031-0833',
            addressRegion: '青森県',
            addressLocality: '八戸市',
            streetAddress: '大字大久保字小久保平19-7',
            addressCountry: 'JP'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 40.5122,
            longitude: 141.4883
          },
          priceRange: '$$',
          currenciesAccepted: 'JPY',
          paymentAccepted: '銀行振込',
          numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: 10,
            maxValue: 50
          },
          knowsAbout: [
            '電気設備工事', '電気通信工事', '消防設備工事',
            '空調設備工事', '太陽光発電設備', '物流システム',
            'ビル保守管理', '公共工事'
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: '事業内容',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '電気設備工事',
                  description: '受変電設備・動力設備・照明設備・弱電設備など電気設備の設計から施工まで一貫対応'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '電気通信工事',
                  description: '通信ケーブル・LAN配線・電話設備・放送設備などの設計施工'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '消防設備工事',
                  description: '自動火災報知設備・スプリンクラー・避難設備などの設計施工・保守点検'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '空調設備工事',
                  description: '業務用エアコン・換気設備・空調ダクト工事の設計施工'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '太陽光発電設備設計施工',
                  description: '産業用・住宅用太陽光発電システムの設計・施工・保守管理'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '物流システム・機械設備工事',
                  description: 'コンベヤ・仕分け機・自動倉庫など物流設備の設計施工・保守管理'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '設計施工',
                  description: '電気・機械設備の総合設計施工。プロジェクト管理から竣工まで一括対応'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'ビル保守管理',
                  description: '電気設備・空調設備・消防設備の定期点検・保守・24時間対応'
                }
              }
            ]
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
          ],
          sameAs: [
            'https://maps.google.com/?q=株式会社創電工業+青森県八戸市大字大久保字小久保平19-7',
            'https://www.google.com/maps/place/株式会社創電工業'
          ]
        },
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: baseUrl,
          name: '株式会社創電工業',
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
          dateModified: new Date().toISOString().split('T')[0],
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: data.image
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: this.buildBreadcrumbs(data.url, data.title)
          }
        }
      ]
    };

    this.upsertJsonLd('structured-data', structuredData);
  }

  private buildBreadcrumbs(url: string, title: string): unknown[] {
    const baseUrl = new URL('/', url).toString().replace(/\/$/, '');
    const items: unknown[] = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: baseUrl
      }
    ];

    const pathname = new URL(url).pathname;
    if (pathname !== '/' && pathname !== '') {
      const pathNames: Record<string, string> = {
        '/company': '会社概要',
        '/recruit': '採用情報'
      };
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: pathNames[pathname] ?? title,
        item: url
      });
    }

    return items;
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
