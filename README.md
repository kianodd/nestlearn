# NestLearn

آموزش قدم‌به‌قدم NestJS با ساختن یک فروشگاه کتاب واقعی (**NestShop**) — مثل دوره‌ی Learn نکست‌جی‌اس.

## چی یاد می‌گیری

| فصل | موضوع |
| --- | --- |
| ۰ | شروع: ساخت NestShop با Nest CLI، اولین Controller |
| ۱ | NestJS از پایه: Module، DI، Pipe، Guard، Interceptor، Exception Filter |
| ۲ | TypeORM: Entity، Relations، Migration، QueryBuilder، Transaction |
| ۳ | Drizzle: schema-first، کوئری، Migration، مقایسه با TypeORM |
| ۴ | Zod: اسکیما، ZodValidationPipe، خطاهای فارسی، مقایسه با class-validator |
| ۵ | Prisma: schema.prisma، CRUD، Relations، جدول تصمیم‌گیری سه ORM |
| ۶ | تکمیل پروژه: JWT، Pagination/Search، تست، لاگ، دیپلوی |

۷ فصل، ۳۵ قدم. هر قدم یک دیاگرام متحرک جریان درخواست (به سبک Protocol Explorer)، یک جدول Wireshark-style، کد واقعی TypeScript و یک «چک کن» عملی دارد.

## امکانات سایت

- PWA: آفلاین کار می‌کند، قابل نصب
- ترکر پیشرفت: تیک «این درس رو خوندم» برای هر قدم، در localStorage ذخیره می‌شود (`nestlearn-progress-v1`)
- جستجو با Ctrl+K، تم روشن/تیره، کاملا RTL و موبایل‌فرندلی
- بدون هیچ بیلد: HTML/CSS/JS خام — GitHub Pages مستقیم سرو می‌کند

## دیپلوی

```bash
python3 push.py   # Git Data API با PAT — ریپوی kianodd/nestlearn + GitHub Pages
```

لایو: https://kianodd.github.io/nestlearn/
