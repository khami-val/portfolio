import rGr0 from './assets/r_gr0.jpg'
import rGr1 from './assets/r_gr1.jpg'
import rGr3 from './assets/r_gr3.jpg'
import rGr4 from './assets/r_gr4.jpg'
import rGr5 from './assets/r_gr5.jpg'
import rGr7 from './assets/r_gr7.jpg'
import rTp0 from './assets/r_tp0.jpg'
import rTp1 from './assets/r_tp1.jpg'
import rTp2 from './assets/r_tp2.jpg'
import rTp3 from './assets/r_tp3.jpg'
import rGr2 from './assets/r_gr2.jpg'
import rGr6 from './assets/r_gr6.jpg'
import oHero from './assets/o_hero.jpg'
import oAbout from './assets/o_about.jpg'
import mkGrantekD from './assets/mk_grantek_d.webp'
import mkGrantekM from './assets/mk_grantek_m.webp'
import mkTeplezhD from './assets/mk_teplezh_d.webp'
import mkTeplezhM from './assets/mk_teplezh_m.webp'
import mkOksanaD from './assets/mk_oksana_d.webp'
import mkOksanaM from './assets/mk_oksana_m.webp'

/* Hero ring: fresh screens of the client sites + product demos */
export const marquee = [
  { src: rGr0, alt: 'Грантек: перший екран' },
  { src: rTp0, alt: 'TEPLEZH: перший екран' },
  { src: oHero, alt: 'Oksana Aesthetics: перший екран' },
  { src: rGr1, alt: 'Грантек: каталог' },
  { src: rGr2, alt: 'Грантек: полотно ППЕ' },
  { src: rTp1, alt: 'TEPLEZH: нові надходження' },
  { src: rGr3, alt: 'Грантек: профілі та ізоляція' },
  { src: oAbout, alt: 'Oksana Aesthetics: про мене' },
  { src: rTp2, alt: 'TEPLEZH: бестселер' },
  { src: rGr5, alt: 'Грантек: дилерам' },
  { src: rGr6, alt: 'Грантек: переваги виробника' },
  { src: rGr4, alt: 'Грантек: пакети та наповнювач' },
  { src: rTp3, alt: 'TEPLEZH: лукбук' },
  { src: rGr7, alt: 'Грантек: зворотний дзвінок' },
]

export const services = [
  { name: 'ШІ-адміністратор 24/7', desc: 'Відповідає в Direct, Telegram і Viber за 30 секунд, консультує за вашим прайсом і записує в CRM. Складні питання передає живому адміну.' },
  { name: 'ШІ-рішення під ключ', desc: 'Асистент, лендинг і 3 рекламні відео як одна система. Плюс щомісячний звіт: скільки звернень прийшло вночі й скільки з них записалося.' },
  { name: 'Сайти й лендинги', desc: 'Послуги, ціни, відгуки, кнопка запису й аналітика. Швидко відкривається з телефону.' },
  { name: 'ШІ-бот', desc: 'Бот для Telegram або Instagram: FAQ, квізи, видача матеріалів, збір заявок у таблицю.' },
]

export const projects = [
  {
    name: 'Грантек',
    category: 'Клієнт · концепт редизайну',
    desc: 'B2B-сайт виробника спіненого поліетилену: каталог, галузі, запит ціни.',
    href: 'https://grantek.vercel.app/',
    domain: 'grantek.vercel.app',
    desktop: mkGrantekD,
    mobile: mkGrantekM,
  },
  {
    name: 'TEPLEZH',
    category: 'Клієнт · ювелірний магазин',
    desc: 'Інтернет-магазин прикрас ручної роботи: каталог, фільтри, кошик, UA/EN.',
    href: 'https://teplezh-site.vercel.app/uk',
    domain: 'teplezh-site.vercel.app',
    desktop: mkTeplezhD,
    mobile: mkTeplezhM,
  },
  {
    name: 'Oksana Aesthetics',
    category: 'Клієнт · естетичний косметолог, Київ',
    desc: 'Сайт косметолога: послуги й ціни, роботи та онлайн-запис за 3 кроки.',
    href: 'https://oksana-aesthetics.vercel.app/',
    domain: 'oksana-aesthetics.vercel.app',
    desktop: mkOksanaD,
    mobile: mkOksanaM,
  },
]

export const plans = [
  { tag: 'Старт', name: 'ШІ-адміністратор 24/7', price: '15 000', unit: 'грн', items: ['Instagram, Telegram або Viber', 'Навчання на вашому прайсі та FAQ', 'Передача складних питань адміну', '30 днів донавчання'] },
  { tag: 'Рекомендую', name: 'Під ключ', price: '30 000', unit: 'грн', items: ['ШІ-адміністратор у всіх каналах', 'Лендинг із записом і аналітикою', '3 рекламні відео 9:16', 'Звіт: звернення поза робочим часом'], hot: true },
  { tag: 'Після запуску', name: 'Супровід', price: '4 500', unit: 'грн / міс', items: ['Оновлення прайсу й відповідей', '1 нове відео щомісяця', 'Щомісячний звіт', 'Правки сайту'] },
]
