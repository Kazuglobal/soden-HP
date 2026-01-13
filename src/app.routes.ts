import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { RecruitDetailsComponent } from './components/recruit-details/recruit-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: '株式会社創電工業 | 電気設備工事・設計施工（青森県八戸市）',
      description: '青森県八戸市の株式会社創電工業。電気設備工事・電気通信工事・消防設備・空調設備・物流システムの設計施工から保守管理まで対応。1987年創業の実績。',
      keywords: '創電工業,電気工事,電気設備,電気通信工事,消防設備,空調設備,物流システム,設計施工,保守管理,八戸,青森',
      image: '/images/companyinfo.png',
      imageAlt: '創電工業のチーム'
    }
  },
  {
    path: 'company',
    component: CompanyDetailsComponent,
    data: {
      title: '会社概要 | 株式会社創電工業',
      description: '会社概要・沿革・所在地・事業内容を掲載。青森県八戸市で電気設備工事・機械設備・防災管理を行う株式会社創電工業。',
      keywords: '会社概要,企業情報,沿革,所在地,電気工事,電気設備,八戸,青森,創電工業',
      image: '/images/companyinfo.png',
      imageAlt: '株式会社創電工業の会社情報'
    }
  },
  {
    path: 'recruit',
    component: RecruitDetailsComponent,
    data: {
      title: '採用情報 | 株式会社創電工業',
      description: '採用情報・社員紹介・エントリーフォーム。電気工事士・施工管理士の求人を青森県八戸市で募集。',
      keywords: '採用情報,求人,電気工事士,施工管理,未経験,八戸,青森,創電工業',
      image: '/images/recruit_hero_bright.png',
      imageAlt: '創電工業の採用情報'
    }
  },
  { path: '**', redirectTo: '' }
];
