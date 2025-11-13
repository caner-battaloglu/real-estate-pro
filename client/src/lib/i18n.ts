"use client";

import { useMemo } from "react";
import { Language, useCountry } from "./country-context";

type TranslationDictionary = Record<string, string>;

const translations: Record<Language, TranslationDictionary> = {
  en: {},
  tr: {
    "landing.title.prefix": "",
    "landing.title.suffix": "'ya Hoş Geldiniz",
    "landing.subtitle": "Konumunuza özel ilanları görmek için ülkenizi seçin. Fiyatlar ve ölçüler seçiminize göre gösterilir.",
    "landing.currency.usd": "Para Birimi:",
    "landing.currency.try": "Para Birimi:",
    "landing.unit.us": "Metrekare birimi:",
    "landing.unit.tr": "Metrekare birimi:",
    "landing.currency.usd.value": "USD ($)",
    "landing.currency.try.value": "TRY (₺)",
    "landing.unit.us.value": "Fit Kare (sq ft)",
    "landing.unit.tr.value": "Metrekare (m²)",
    "landing.select.usa": "ABD'yi Seç",
    "landing.select.turkey": "Türkiye'yi Seç",
    "landing.card.usa": "USD üzerinden ilanları görüntüleyin ve ölçüleri fit kare olarak görün",
    "landing.card.turkey": "TRY üzerinden ilanları görüntüleyin ve ölçüleri metrekare olarak görün",
    "navigation.home": "Anasayfa",
    "navigation.properties": "İlanlar",
    "navigation.agents": "Danışmanlar",
    "navigation.about": "Hakkımızda",
    "navigation.contact": "İletişim",
    "navigation.dashboard": "Panel",
    "navigation.addProperty": "İlan Ekle",
    "navigation.logoutSuccess": "Başarıyla çıkış yapıldı.",
    "navigation.logoutError": "Çıkış işlemi başarısız oldu. Lütfen tekrar deneyin.",
    "navigation.signOut": "Çıkış Yap",
    "navigation.login": "Giriş Yap",
    "navigation.register": "Kayıt Ol",
    "navigation.getStarted": "Hemen Başla",
    "home.hero.badge": "Hayalinizdeki Evi Bulun",
    "home.hero.title": "Mükemmel İlanınızı Keşfedin",
    "home.hero.subtitle": "En iyi danışmanlarla tanışın, binlerce ilanı inceleyin ve kapsamlı emlak platformumuzla doğru kararı verin.",
    "home.hero.searchPlaceholder": "Konum, ilan tipi veya fiyat arayın...",
    "home.hero.searchButton": "İlan Ara",
    "home.hero.noResults": "\"{query}\" için sonuç bulunamadı.",
    "home.stats.listed": "Yayınlanan İlan",
    "home.stats.clients": "Mutlu Müşteri",
    "home.stats.agents": "Uzman Danışman",
    "home.stats.cities": "Hizmet Verilen Şehir",
    "home.featured.badge": "Öne Çıkan İlanlar",
    "home.featured.heading": "Öne Çıkan İlanları Keşfedin",
    "home.featured.subheading": "En iyi lokasyonlar ve ayrıcalıklı imkanlara sahip özenle seçilmiş ilanlar.",
    "home.featured.viewAll": "Tüm İlanları Gör",
    "home.featured.label": "Öne Çıkan",
    "home.featured.viewDetails": "Detayları Gör",
    "home.features.badge": "Neden Bizi Tercih Etmelisiniz",
    "home.features.heading": "Emlak İçin İhtiyacınız Olan Her Şey",
    "home.features.subheading": "Emlak alım, satım veya kiralama süreçlerinizde ihtiyaç duyduğunuz tüm araç ve kaynaklar.",
    "home.feature.secure.title": "Güvenli İşlemler",
    "home.feature.secure.description": "Tüm gayrimenkul işlemleriniz için banka seviyesinde güvenlik",
    "home.feature.expert.title": "Uzman Danışmanlar",
    "home.feature.expert.description": "Doğrulanmış ve deneyimli emlak profesyonelleriyle çalışın",
    "home.feature.market.title": "Pazar Analizleri",
    "home.feature.market.description": "Gerçek zamanlı pazar verileri ve değer tahminleri edinin",
    "home.feature.virtual.title": "Sanal Turlar",
    "home.feature.virtual.description": "Her yerden 360° sanal turlarla ilanları keşfedin",
    "home.cta.title": "Hayalinizdeki Evi Bulmaya Hazır mısınız?",
    "home.cta.subtitle": "Platformumuzla hayallerindeki evi bulan binlerce mutlu kullanıcıya katılın.",
    "home.cta.browse": "İlanları İncele",
    "home.cta.findAgent": "Danışman Bul",
    "properties.title": "İlanlar",
    "properties.subtitle": "Özenle seçilmiş ilanlarımızla hayalinizdeki evi keşfedin.",
    "properties.searchPlaceholder": "İlanlarda arayın...",
    "properties.filters": "Filtreler",
    "properties.view.grid": "Izgara",
    "properties.view.list": "Liste",
    "properties.filter.type": "İlan Tipi",
    "properties.filter.minPrice": "Minimum Fiyat",
    "properties.filter.maxPrice": "Maksimum Fiyat",
    "properties.filter.bedrooms": "Yatak Odası",
    "properties.filter.bathrooms": "Banyo",
    "properties.filter.minArea": "Minimum Alan",
    "properties.filter.maxArea": "Maksimum Alan",
    "properties.filter.location": "Konum",
    "properties.filter.allTypes": "Tüm Tipler",
    "properties.filter.any": "Fark Etmez",
    "properties.filter.locationPlaceholder": "Şehir veya eyalet",
    "properties.filter.clear": "Filtreleri Temizle",
    "properties.results.loading": "Yükleniyor...",
    "properties.results.count": "{count} ilan bulundu",
    "properties.results.empty": "Kriterlerinize uygun ilan bulunamadı.",
    "properties.results.emptyAction": "Filtreleri Temizle",
    "properties.card.viewDetails": "Detayları Gör",
    "property.back": "İlanlara Dön",
    "property.features": "Özellikler",
    "property.amenities": "Olanaklar",
    "property.description": "Açıklama",
    "property.contactAgent": "Danışmanla İletişim",
    "property.callAgent": "Danışmanı Ara",
    "property.emailAgent": "Danışmana E-posta Gönder",
    "property.scheduleTour": "Görüşme Randevusu Al",
    "property.scheduleTourDescription": "Bu ilan için özel bir ziyaret planlayın",
    "property.scheduleTourTitle": "İlan Randevusu Oluştur",
    "property.tourBooked": "Randevu oluşturuldu!",
    "property.tourConfirm": "Detayları onaylamak için en kısa sürede sizinle iletişime geçeceğiz.",
    "property.selectDate": "Tarih Seçin",
    "property.selectTime": "Saat Seçin",
    "property.chooseTime": "Bir saat seçin",
    "property.contactMethod": "Tercih edilen iletişim yöntemi",
    "property.contactMethod.phone": "Telefon",
    "property.contactMethod.email": "E-posta",
    "property.additionalMessage": "Ek Mesaj (İsteğe Bağlı)",
    "property.cancel": "İptal",
    "property.book": "Randevu Al",
    "property.booking": "Randevu alınıyor...",
    "property.listed": "İlan Tarihi",
    "property.info": "İlan Bilgileri",
    "property.id": "İlan No",
    "property.type": "Tip",
    "property.status": "Durum",
    "property.bedrooms": "Yatak Odası",
    "property.bathrooms": "Banyo",
    "property.area": "Alan",
    "property.built": "Yapım Yılı",
    "property.type.apartment": "Daire",
    "property.type.house": "Müstakil Ev",
    "property.type.condo": "Rezidans",
    "property.type.townhouse": "Sıra Ev",
    "property.type.villa": "Villa",
    "property.type.commercial": "Ticari",
    "property.type.studio": "Stüdyo",
    "property.tourConfirmationTitle": "Randevu Onayı",
    "property.tourConfirmationNote": "{name}, randevu detaylarını onaylamak için tercih ettiğiniz iletişim kanalı üzerinden sizinle iletişime geçeceğiz.",
    "property.tourConfirmationGuest": "Misafir",
    "landing.usa.title": "Birleşik Devletler",
    "landing.turkey.title": "Türkiye",
    "navigation.brand": "RealEstate Pro",
    "navigation.favorites": "Favoriler",
    "navigation.profile": "Profil",
    "navigation.language": "Dil"
  }
};

function translate(key: string, language: Language, defaultValue: string, replacements?: Record<string, string | number>): string {
  const dictionary = translations[language] ?? {};
  let value = dictionary[key] ?? defaultValue;
  if (replacements) {
    Object.entries(replacements).forEach(([replacementKey, replacementValue]) => {
      value = value.replace(`{${replacementKey}}`, String(replacementValue));
    });
  }
  return value;
}

export function useTranslations() {
  const { language } = useCountry();

  return useMemo(() => {
    return (key: string, defaultValue: string, replacements?: Record<string, string | number>) =>
      translate(key, language ?? "en", defaultValue, replacements);
  }, [language]);
}
