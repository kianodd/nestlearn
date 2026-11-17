/* NestLearn — course data. Persian lessons, LTR code. */
const COURSE = {
  app: "NestShop",
  chapters: [
    {
      id: 0, title: "شروع: ساخت NestShop", sub: "Nest CLI، ساختار پروژه، اولین Controller",
      steps: [
        {
          id: "0.1", title: "نصب Nest CLI و ساخت پروژه",
          goal: "با یک دستور، اسکلت کامل NestShop را بساز و اجراش کن.",
          intro: [
            "NestJS یک فریم‌ورک بک‌اند روی Node.js است که معماری آماده می‌دهد: ماژول، کنترلر و سرویس از روز اول سر جای خودشان هستند. به‌جای اینکه از صفر فایل‌بندی اختراع کنی، از Nest CLI استفاده می‌کنیم؛ همان ابزاری که خود تیم Nest ساخته.",
            "پروژه‌ی دوره یک فروشگاه کتاب است: NestShop. کاربر کتاب‌ها را می‌بیند، جستجو می‌کند، سفارش می‌دهد و مدیر وارد می‌شود. همه‌ی فصل‌های بعدی، یک تکه به همین پروژه اضافه می‌کنند — نه یک مثال جدا."
          ],
          facts: [["ابزار", "Nest CLI (@nestjs/cli)"], ["مدیر بسته", "npm"], ["زبان", "TypeScript"], ["پورت پیش‌فرض", "3000"]],
          callout: { label: "دستور این قدم", code: "$ npm i -g @nestjs/cli\n$ nest new nestshop\n$ cd nestshop && npm run start:dev" },
          code: [{ path: "package.json — اسکریپت‌ها", lang: "json", code: `{\n  "scripts": {\n    "start:dev": "nest start --watch",\n    "start:prod": "node dist/main",\n    "build": "nest build",\n    "test": "jest"\n  }\n}` }],
          hops: [
            { from: "client", to: "controller", type: "CLI", info: "nest new nestshop", size: "—", color: "blue" },
            { from: "controller", to: "service", type: "Scaffold", info: "src/app.module.ts + main.ts ساخته شد", size: "—", color: "green" },
            { from: "service", to: "db", type: "Run", info: "npm run start:dev → listening on 3000", size: "—", color: "teal" }
          ],
          check: "مرورگر را باز کن و به localhost:3000 برو؛ باید «Hello World!» ببینی. اگر خطا گرفتی، نسخه‌ی Node را چک کن (۲۰ یا بالاتر)."
        },
        {
          id: "0.2", title: "ساختار پروژه و main.ts",
          goal: "بدانی هر فایل کجاست و درخواست از کجا وارد برنامه می‌شود.",
          intro: [
            "ورود درخواست به NestJS از main.ts شروع می‌شود: یک NestFactory اپ را می‌سازد و روی پورت ۳۰۰۰ گوش می‌دهد. همه‌چیز دیگر زیرمجموعه‌ی AppModule است.",
            "قانون طلایی Nest: هر قابلیت یک ماژول است. کتاب‌ها یک ماژول، سفارش‌ها یک ماژول، احراز هویت یک ماژول. داخل هر ماژول، کنترلر درخواست را می‌گیرد و سرویس منطق را انجام می‌دهد."
          ],
          facts: [["نقطه‌ی ورود", "src/main.ts"], ["ریشه‌ی ماژول‌ها", "src/app.module.ts"], ["پیش‌فرض HTTP", "Express (قابل تعویض با Fastify)"]],
          callout: { label: "جریان ورود درخواست", code: "HTTP → main.ts (bootstrap) → AppModule → BooksModule → BooksController" },
          code: [{ path: "src/main.ts", lang: "ts", code: `import { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  app.setGlobalPrefix('api');\n  await app.listen(3000);\n}\nbootstrap();` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api → main.ts bootstrap", size: "96 B", color: "blue" },
            { from: "controller", to: "service", type: "Route", info: "AppModule ریشه را resolve می‌کند", size: "—", color: "green" },
            { from: "service", to: "db", type: "Ready", info: "Application is running on port 3000", size: "—", color: "teal" }
          ],
          check: "در main.ts مقدار setGlobalPrefix را به api تغییر بده و دوباره اجرا کن؛ حالا Hello World فقط روی ‎/api‎ جواب می‌دهد."
        },
        {
          id: "0.3", title: "اولین Controller: GET /books",
          goal: "اولین اندپوینت واقعی NestShop را بنویس: لیست کتاب‌ها.",
          intro: [
            "کنترلر در Nest فقط یک کلاس با دکوراتور است. ‎@Controller('books')‎ می‌گوید همه‌ی متدهای این کلاس زیر مسیر ‎/books‎ هستند و ‎@Get()‎ می‌گوید این متد به GET جواب می‌دهد.",
            "فعلا داده‌ها را در حافظه نگه می‌داریم؛ دیتابیس فصل بعد می‌آید. مهم این است که قرارداد API از همین حالا درست باشد: لیست کتاب‌ها با id، عنوان، نویسنده و قیمت."
          ],
          facts: [["دکوراتور مسیر", "@Controller('books')"], ["دکوراتور متد", "@Get()"], ["پاسخ", "JSON — خودکار"]],
          callout: { label: "درخواست", code: "GET /api/books → 200 OK\n[{ \"id\": 1, \"title\": \"Clean Code\", \"price\": 420000 }]" },
          code: [{ path: "src/books/books.controller.ts", lang: "ts", code: `import { Controller, Get } from '@nestjs/common';\n\n@Controller('books')\nexport class BooksController {\n  private books = [\n    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', price: 420000 },\n    { id: 2, title: 'Design Patterns', author: 'Gang of Four', price: 580000 },\n  ];\n\n  @Get()\n  findAll() {\n    return this.books;\n  }\n}` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
            { from: "controller", to: "service", type: "Call", info: "findAll() — فعلا آرایه‌ی درون‌حافظه", size: "—", color: "green" },
            { from: "service", to: "client", type: "HTTP", info: "200 OK — JSON با ۲ کتاب", size: "312 B", color: "purple" }
          ],
          check: "با curl تست کن: curl localhost:3000/api/books — باید JSON دو کتاب برگردد. بعد یک کتاب سوم به آرایه اضافه کن و دوباره تست بگیر."
        },
        {
          id: "0.4", title: "Module و سازماندهی BooksModule",
          goal: "کتاب‌ها را به یک ماژول مستقل تبدیل کن تا پروژه شلخته نشود.",
          intro: [
            "ماژول، جعبه‌ی یک قابلیت است: کنترلرها و سرویس‌های مربوط به کتاب فقط داخل BooksModule زندگی می‌کنند. AppModule فقط ماژول‌ها را کنار هم می‌چیند.",
            "این جداسازی همان چیزی است که Nest را از Express خام جدا می‌کند: وقتی پروژه بزرگ شد، هر تیم روی ماژول خودش کار می‌کند و وابستگی‌ها شفاف‌اند."
          ],
          facts: [["دکوراتور", "@Module({ controllers, providers })"], ["ثبت در ریشه", "imports: [BooksModule] در AppModule"]],
          callout: { label: "وابستگی ماژول‌ها", code: "AppModule\n└── BooksModule\n    ├── BooksController\n    └── BooksService" },
          code: [{ path: "src/books/books.module.ts", lang: "ts", code: `import { Module } from '@nestjs/common';\nimport { BooksController } from './books.controller';\nimport { BooksService } from './books.service';\n\n@Module({\n  controllers: [BooksController],\n  providers: [BooksService],\n})\nexport class BooksModule {}` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
            { from: "controller", to: "service", type: "DI", info: "BooksService از طریق Module تزریق شد", size: "—", color: "green" },
            { from: "service", to: "client", type: "HTTP", info: "200 OK — لیست کتاب‌ها", size: "312 B", color: "purple" }
          ],
          check: "BooksService را بساز، آرایه‌ی کتاب‌ها را به آن منتقل کن و در کنترلر تزریقش کن. خروجی GET باید دقیقاً مثل قبل بماند."
        },
        {
          id: "0.5", title: "اجرای پروژه و تست با curl",
          goal: "چرخه‌ی توسعه را ببند: watch mode، خطا، و تست دستی اندپوینت‌ها.",
          intro: [
            "با ‎npm run start:dev‎ هر بار که فایل را ذخیره می‌کنی، سرور خودکار ری‌استارت می‌شود. این چرخه‌ی «تغییر → ذخیره → تست با curl» ستون فقرات همه‌ی فصل‌های بعدی است.",
            "curl را دست‌کم نگیر: قبل از اینکه فرانت‌اند یا Postman را باز کنی، با curl مطمئن شو API درست جواب می‌دهد. خطای ۴۰۴ یعنی مسیر اشتباه است، ۵۰۰ یعنی کد سرویس ترکیده."
          ],
          facts: [["حالت توسعه", "npm run start:dev (watch)"], ["تست دستی", "curl"], ["لاگ", "ترمینال Nest — هر درخواست لاگ می‌شود"]],
          callout: { label: "دستورهای تست", code: "$ curl localhost:3000/api/books\n$ curl -i localhost:3000/api/books/999   # 404 بعدی" },
          code: [{ path: "terminal", lang: "bash", code: `$ npm run start:dev\n# [Nest] LOG  Nest application successfully started\n# [Nest] LOG  BooksController {/api/books}:\n# [Nest] LOG  Mapped {/api/books, GET} route` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
            { from: "controller", to: "service", type: "Call", info: "findAll()", size: "—", color: "green" },
            { from: "service", to: "client", type: "HTTP", info: "200 OK", size: "312 B", color: "purple" },
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books/999 → 404", size: "152 B", color: "amber" }
          ],
          check: "یک مسیر اشتباه (مثلا ‎/api/xyz‎) را curl بزن و پاسخ ۴۰۴ را ببین. بعد در ترمینال، خط «Mapped route» برای BooksController را پیدا کن."
        }
      ]
    },
    {
      id: 1, title: "NestJS از پایه", sub: "Module، Controller، Provider، DI، Pipe، Guard، Interceptor",
      steps: [
        {
          id: "1.1", title: "Modules و Dependency Injection",
          goal: "بفهمی Nest چطور وابستگی‌ها را خودش تزریق می‌کند و چرا این کار تست را آسان می‌کند.",
          intro: [
            "Dependency Injection یعنی کلاس، وابستگی‌اش را خودش نمی‌سازد؛ Nest آن را می‌سازد و در constructor تحویل می‌دهد. BooksController فقط می‌گوید «یک BooksService می‌خواهم» و باقی‌اش با فریم‌ورک است.",
            "نتیجه‌ی عملی: در تست می‌توانی یک BooksService قلابی جایگزین کنی بدون اینکه کنترلر را دست بزنی. همین یک ایده، دلیل اصلی معماری Nest است."
          ],
          facts: [["تزریق", "constructor(private books: BooksService)"], ["اسکوپ پیش‌فرض", "Singleton — یک نمونه برای کل اپ"], ["جای تزریق", "providers در Module"]],
          callout: { label: "اصل DI", code: "// کنترلر نمی‌سازد، فقط می‌خواهد:\nconstructor(private readonly booksService: BooksService) {}" },
          code: [{ path: "src/books/books.controller.ts", lang: "ts", code: `import { Controller, Get } from '@nestjs/common';\nimport { BooksService } from './books.service';\n\n@Controller('books')\nexport class BooksController {\n  constructor(private readonly booksService: BooksService) {}\n\n  @Get()\n  findAll() {\n    return this.booksService.findAll();\n  }\n}` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
            { from: "controller", to: "service", type: "DI", info: "Nest نمونه‌ی BooksService را تزریق می‌کند", size: "—", color: "green" },
            { from: "service", to: "client", type: "HTTP", info: "200 OK — لیست کتاب‌ها", size: "312 B", color: "purple" }
          ],
          check: "در BooksService یک متد findAll با console.log اضافه کن؛ با هر درخواست باید لاگ بخورد و ثابت شود همان نمونه‌ی singleton صدا زده می‌شود."
        },
        {
          id: "1.2", title: "Providers و Service ها",
          goal: "منطق کسب‌وکار را از کنترلر جدا کن و در سرویس بگذار.",
          intro: [
            "قانون: کنترلر فقط «ترجمه» می‌کند — درخواست HTTP را به صدای سرویس تبدیل می‌کند و جواب را برمی‌گرداند. هر if و محاسبه‌ی واقعی مال سرویس است.",
            "در NestShop، سرویس کتاب مسئول پیدا کردن، فیلتر و ساختن کتاب است. اگر فردا به‌جای آرایه، دیتابیس آمد (فصل ۲)، فقط سرویس عوض می‌شود؛ کنترلر دست نمی‌خورد."
          ],
          facts: [["جای منطق", "Service"], ["جای HTTP", "Controller"], ["Provider", "هر کلاسی که با @Injectable() علامت خورده"]],
          callout: { label: "مرز مسئولیت", code: "Controller: params/query/body → صدا زدن سرویس\nService:    منطق + داده → برگرداندن نتیجه" },
          code: [{ path: "src/books/books.service.ts", lang: "ts", code: `import { Injectable, NotFoundException } from '@nestjs/common';\n\n@Injectable()\nexport class BooksService {\n  private books = [\n    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', price: 420000, stock: 5 },\n  ];\n\n  findAll() { return this.books; }\n\n  findOne(id: number) {\n    const book = this.books.find((b) => b.id === id);\n    if (!book) throw new NotFoundException('کتاب پیدا نشد');\n    return book;\n  }\n}` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books/1", size: "186 B", color: "blue" },
            { from: "controller", to: "service", type: "Call", info: "findOne(1)", size: "—", color: "green" },
            { from: "service", to: "client", type: "HTTP", info: "200 OK — یک کتاب", size: "210 B", color: "purple" },
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books/999 → 404", size: "190 B", color: "amber" }
          ],
          check: "متد findOne را به کنترلر وصل کن (‎@Get(':id')‎) و هر دو حالت ۲۰۰ و ۴۰۴ را با curl تست کن."
        },
        {
          id: "1.3", title: "Pipes و ValidationPipe",
          goal: "ورودی کاربر را قبل از رسیدن به سرویس، اعتبارسنجی و تبدیل کن.",
          intro: [
            "Pipe مثل نگهبانِ ورودی عمل می‌کند: پارامتر ‎:id‎ که در URL رشته است را به عدد تبدیل می‌کند (ParseIntPipe) و بدنه‌ی POST را با ValidationPipe بررسی می‌کند.",
            "بدون Pipe، هر متد کنترلر باید خودش type-check و if بنویسد. با Pipe، ورودیِ بد هرگز به سرویس نمی‌رسد و خطای ۴۰۰ یکدست برمی‌گردد."
          ],
          facts: [["تبدیل نوع", "ParseIntPipe"], ["اعتبارسنجی بدنه", "ValidationPipe + class-validator"], ["جای اجرا", "قبل از Guard؟ نه — بعد از Guard، قبل از Handler"]],
          callout: { label: "ترتیب اجرا", code: "Request → Guard → Interceptor (pre) → Pipe → Handler → Interceptor (post)" },
          code: [{ path: "src/books/books.controller.ts", lang: "ts", code: `import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';\nimport { CreateBookDto } from './dto/create-book.dto';\n\n@Controller('books')\nexport class BooksController {\n  @Get(':id')\n  findOne(@Param('id', ParseIntPipe) id: number) {\n    return this.booksService.findOne(id);\n  }\n\n  @Post()\n  create(@Body() dto: CreateBookDto) {\n    return this.booksService.create(dto);\n  }\n}` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books/abc", size: "188 B", color: "blue" },
            { from: "controller", to: "service", type: "Pipe", info: "ParseIntPipe: 'abc' عدد نیست → 400", size: "—", color: "amber" },
            { from: "service", to: "client", type: "HTTP", info: "400 Bad Request", size: "240 B", color: "purple" }
          ],
          check: "GET /api/books/abc را بزن؛ باید ۴۰۰ بگیری نه ۵۰۰. بعد ValidationPipe را سراسری در main.ts فعال کن: app.useGlobalPipes(new ValidationPipe({ whitelist: true }))."
        },
        {
          id: "1.4", title: "Guards و Interceptors",
          goal: "دسترسی را با Guard کنترل کن و پاسخ‌ها را با Interceptor یکدست کن.",
          intro: [
            "Guard جواب یک سوال را می‌دهد: «این درخواست اجازه دارد ادامه بدهد؟» — مثلا آیا توکن دارد؟ اگر نه، ۴۰۱ برمی‌گردد و درخواست هرگز به کنترلر نمی‌رسد.",
            "Interceptor دورِ handler می‌پیچد: قبل از اجرا می‌تواند لاگ بزند و بعد از اجرا می‌تواند شکل پاسخ را عوض کند. در NestShop یک interceptor می‌سازیم که همه‌ی پاسخ‌ها را به شکل { data } برگرداند."
          ],
          facts: [["Guard", "CanActivate — true/false"], ["Interceptor", "قبل و بعد از handler"], ["کاربرد", "Auth، لاگ، تغییر شکل پاسخ"]],
          callout: { label: "ترتیب کامل", code: "Middleware → Guard → Interceptor (pre) → Pipe → Handler → Interceptor (post) → ExceptionFilter" },
          code: [{ path: "src/common/interceptors/transform.interceptor.ts", lang: "ts", code: `import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';\nimport { Observable } from 'rxjs';\nimport { map } from 'rxjs/operators';\n\n@Injectable()\nexport class TransformInterceptor implements NestInterceptor {\n  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {\n    return next.handle().pipe(map((data) => ({ data })));\n  }\n}` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books — بدون توکن", size: "184 B", color: "blue" },
            { from: "controller", to: "service", type: "Guard", info: "AuthGuard: توکن نیست → 401", size: "—", color: "amber" },
            { from: "service", to: "client", type: "HTTP", info: "401 Unauthorized", size: "180 B", color: "purple" }
          ],
          check: "TransformInterceptor را سراسری ثبت کن و GET /books را بزن؛ پاسخ باید به شکل { data: [...] } برگردد."
        },
        {
          id: "1.5", title: "Exception Filters و پاسخ یکدست",
          goal: "همه‌ی خطاها را به یک شکل JSON برگردان تا فرانت‌اند سردرگم نشود.",
          intro: [
            "وقتی سرویس NotFoundException پرتاب می‌کند، Nest خودش آن را به ۴۰۴ تبدیل می‌کند. اما برای خطاهای پیش‌بینی‌نشده و برای یکدست کردن شکل خطا، یک Exception Filter سراسری می‌نویسیم.",
            "قرارداد NestShop: هر خطا { statusCode, message, timestamp, path } است. فرانت‌اند فقط یک شکل خطا می‌شناسد و بر اساس statusCode تصمیم می‌گیرد."
          ],
          facts: [["فیلتر داخلی", "HttpException → همان status"], ["فیلتر سفارشی", "@Catch() — همه‌ی خطاها"], ["شکل خطا", "{ statusCode, message, timestamp, path }"]],
          callout: { label: "نمونه‌ی پاسخ خطا", code: "{\n  \"statusCode\": 404,\n  \"message\": \"کتاب پیدا نشد\",\n  \"timestamp\": \"2026-11-17T14:00:00Z\",\n  \"path\": \"/api/books/999\"\n}" },
          code: [{ path: "src/common/filters/http-exception.filter.ts", lang: "ts", code: `import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';\n\n@Catch()\nexport class AllExceptionsFilter implements ExceptionFilter {\n  catch(exception: unknown, host: ArgumentsHost) {\n    const ctx = host.switchToHttp();\n    const res = ctx.getResponse();\n    const req = ctx.getRequest();\n    const status = exception instanceof HttpException\n      ? exception.getStatus()\n      : HttpStatus.INTERNAL_SERVER_ERROR;\n    const message = exception instanceof HttpException\n      ? exception.getResponse()\n      : 'خطای داخلی سرور';\n    res.status(status).json({ statusCode: status, message, timestamp: new Date().toISOString(), path: req.url });\n  }\n}` }],
          hops: [
            { from: "client", to: "controller", type: "HTTP", info: "GET /api/books/999", size: "190 B", color: "blue" },
            { from: "controller", to: "service", type: "Throw", info: "NotFoundException('کتاب پیدا نشد')", size: "—", color: "amber" },
            { from: "service", to: "client", type: "HTTP", info: "404 — { statusCode, message, ... }", size: "260 B", color: "purple" }
          ],
          check: "فیلتر را سراسری ثبت کن و سه حالت ۴۰۰، ۴۰۴ و یک خطای ۵۰۰ عمدی را تست کن؛ شکل JSON هر سه باید یکسان باشد."
        }
      ]
    }
  ]
};
/* ---- فصل ۲ و ۳ ---- */
COURSE.chapters.push(
  {
    id: 2, title: "TypeORM", sub: "Entity، Relations، Migration، QueryBuilder، Transaction",
    steps: [
      {
        id: "2.1", title: "اتصال به Postgres و DataSource",
        goal: "NestShop را به Postgres واقعی وصل کن؛ دیگر آرایه‌ی درون‌حافظه نه.",
        intro: [
          "TypeORM یک ORM کلاسیک است: جدول‌ها را با کلاس‌های TypeScript (Entity) تعریف می‌کنی و TypeORM خودش SQL می‌سازد. اتصال از طریق TypeOrmModule.forRoot در AppModule انجام می‌شود.",
          "برای توسعه‌ی محلی، Postgres را با Docker بالا می‌آوریم. اطلاعات اتصال در ‎.env‎ می‌ماند و هرگز کامیت نمی‌شود."
        ],
        facts: [["پکیج", "@nestjs/typeorm + typeorm + pg"], ["دیتابیس محلی", "Postgres 16 در Docker"], ["تنظیمات", "‎.env‎ — هرگز کامیت نشود"]],
        callout: { label: "اتصال", code: "$ docker run --name nestshop-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=nestshop -p 5432:5432 -d postgres:16" },
        code: [{ path: "src/app.module.ts", lang: "ts", code: `import { Module } from '@nestjs/common';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { BooksModule } from './books/books.module';\n\n@Module({\n  imports: [\n    TypeOrmModule.forRoot({\n      type: 'postgres',\n      host: process.env.DB_HOST ?? 'localhost',\n      port: 5432,\n      username: 'postgres',\n      password: process.env.DB_PASSWORD,\n      database: 'nestshop',\n      autoLoadEntities: true,\n      synchronize: false, // در پروداکشن هرگز true نباشد\n    }),\n    BooksModule,\n  ],\n})\nexport class AppModule {}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "findAll()", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "TypeORM: SELECT * FROM book", size: "64 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "Postgres اجرای کوئری", size: "64 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK — ردیف‌های جدول book", size: "410 B", color: "purple" }
        ],
        check: "کانتینر Postgres را بالا بیاور و با psql وصل شو؛ بعد synchronize را موقتا true کن و ببین جدول book ساخته می‌شود یا نه — بعد دوباره false کن."
      },
      {
        id: "2.2", title: "Entity کتاب و Author",
        goal: "جدول‌ها را با کلاس Entity تعریف کن؛ ستون‌ها همان فیلدهای کلاس‌اند.",
        intro: [
          "Entity یعنی نقشه‌ی جدول در TypeScript. ‎@Entity()‎ روی کلاس، ‎@PrimaryGeneratedColumn()‎ روی id، و ‎@Column()‎ روی هر ستون. نوع ستون، طول و nullable بودن همه اینجا مشخص می‌شود.",
          "در NestShop دو Entity داریم: Book و Author. کتاب قیمت و موجودی دارد؛ نویسنده نام و بیو. رابطه‌شان را قدم بعد می‌سازیم."
        ],
        facts: [["دکوراتور کلاس", "@Entity()"], ["کلید اصلی", "@PrimaryGeneratedColumn()"], ["ستون", "@Column({ length: 200 })"]],
        callout: { label: "قانون", code: "یک Entity = یک جدول. نام جدول پیش‌فرض = نام کلاس با حروف کوچک." },
        code: [{ path: "src/books/entities/book.entity.ts", lang: "ts", code: `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';\n\n@Entity()\nexport class Book {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column({ length: 200 })\n  title: string;\n\n  @Column({ length: 120 })\n  authorName: string;\n\n  @Column('int')\n  price: number;\n\n  @Column('int', { default: 0 })\n  stock: number;\n\n  @CreateDateColumn()\n  createdAt: Date;\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/books", size: "240 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "create(dto)", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "repository.save(book) → INSERT", size: "120 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "INSERT INTO book (title, ...) VALUES (...)", size: "120 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "201 Created — کتاب با id", size: "230 B", color: "purple" }
        ],
        check: "Entity های Book و Author را بنویس و با synchronize موقت، جدول‌ها را در Postgres ببین (‎\\dt‎ در psql)."
      },
      {
        id: "2.3", title: "Relations و Repository",
        goal: "رابطه‌ی نویسنده–کتاب را بساز و با Repository کوئری بزن.",
        intro: [
          "رابطه‌ی OneToMany یعنی یک نویسنده چند کتاب دارد و هر کتاب یک نویسنده. در TypeORM این رابطه با ‎@OneToMany‎ و ‎@ManyToOne‎ تعریف می‌شود و با ‎relations: ['author']‎ در کوئری لود می‌شود.",
          "Repository همان دروازه‌ی داده است: ‎find‎، ‎findOneBy‎، ‎save‎ و ‎delete‎. سرویس فقط با Repository حرف می‌زند و هیچ SQL دستی نمی‌نویسد."
        ],
        facts: [["رابطه", "@OneToMany / @ManyToOne"], ["لود رابطه", "find({ relations: { author: true } })"], ["تزریق ریپو", "@InjectRepository(Book)"]],
        callout: { label: "هشدار N+1", code: "بدون relations، به‌ازای هر کتاب یک کوئری جدا برای نویسنده زده می‌شود. همیشه relations یا join را مشخص کن." },
        code: [{ path: "src/books/books.service.ts", lang: "ts", code: `import { Injectable } from '@nestjs/common';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { Repository } from 'typeorm';\nimport { Book } from './entities/book.entity';\n\n@Injectable()\nexport class BooksService {\n  constructor(\n    @InjectRepository(Book)\n    private readonly books: Repository<Book>,\n  ) {}\n\n  findAll() {\n    return this.books.find({ relations: { author: true } });\n  }\n\n  findOne(id: number) {\n    return this.books.findOne({ where: { id }, relations: { author: true } });\n  }\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "findAll()", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "find({ relations: { author: true } })", size: "90 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "SELECT ... FROM book LEFT JOIN author ...", size: "140 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK — کتاب‌ها همراه نویسنده", size: "520 B", color: "purple" }
        ],
        check: "یک Author بساز و دو کتاب به او وصل کن؛ GET /books باید هر کتاب را با آبجکت author برگرداند، نه فقط authorId."
      },
      {
        id: "2.4", title: "Migration",
        goal: "تغییر اسکیما را با Migration نسخه‌بندی کن، نه با synchronize.",
        intro: [
          "synchronize در توسعه راحت است ولی در پروداکشن خطرناک: می‌تواند ستون را بی‌سروصدا حذف کند. راه درست Migration است — فایلی که تغییر اسکیما را قدم‌به‌قدم توصیف می‌کند و قابل برگشت است.",
          "جریان کار: Entity را عوض می‌کنی، ‎migration:generate‎ تفاوت را می‌سازد، ‎migration:run‎ آن را اعمال می‌کند. هر Migration در جدول migrations ثبت می‌شود."
        ],
        facts: [["ساخت", "typeorm migration:generate"], ["اجرا", "typeorm migration:run"], ["برگرداندن", "migration:revert"]],
        callout: { label: "قانون طلایی", code: "synchronize: false در همه‌ی محیط‌ها به‌جز تست موقت. اسکیما فقط از Migration تغییر کند." },
        code: [{ path: "terminal", lang: "bash", code: `$ npm run typeorm -- migration:generate src/migrations/AddStockToBook -d src/data-source.ts\n$ npm run typeorm -- migration:run -d src/data-source.ts\n# Migration AddStockToBook has been executed successfully.` }],
        hops: [
          { from: "client", to: "controller", type: "CLI", info: "migration:generate — diff اسکیما", size: "—", color: "blue" },
          { from: "controller", to: "service", type: "File", info: "src/migrations/xxx-AddStockToBook.ts ساخته شد", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "migration:run — ALTER TABLE book ADD stock", size: "80 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "ALTER TABLE + ثبت در جدول migrations", size: "80 B", color: "green" }
        ],
        check: "یک ستون جدید (مثلا isbn) به Book اضافه کن، Migration بساز و اجرا کن؛ بعد در psql با ‎\\d book‎ ستون را ببین."
      },
      {
        id: "2.5", title: "QueryBuilder و Transaction",
        goal: "کوئری‌های پیچیده را با QueryBuilder بنویس و سفارش را در Transaction ثبت کن.",
        intro: [
          "وقتی find ساده جواب نمی‌دهد — مثلا «کتاب‌های موجود با قیمت زیر X که نویسنده‌شان فعال است» — QueryBuilder همان SQL را با API تایپ‌شده می‌سازد.",
          "ثبت سفارش دو کار هم‌زمان است: کم کردن موجودی کتاب و ساخت ردیف سفارش. اگر یکی شکست، هر دو باید برگردند؛ این کار Transaction است."
        ],
        facts: [["QueryBuilder", "createQueryBuilder('book')"], ["Transaction", "dataSource.transaction(async manager => ...)"], ["قفل ردیف", "pessimistic_write برای موجودی"]],
        callout: { label: "چرا Transaction؟", code: "بدون تراکنش: موجودی کم می‌شود ولی سفارش ساخته نمی‌شود → داده‌ی خراب. با تراکنش: یا هر دو، یا هیچ‌کدام." },
        code: [{ path: "src/orders/orders.service.ts", lang: "ts", code: `import { Injectable } from '@nestjs/common';\nimport { DataSource } from 'typeorm';\n\n@Injectable()\nexport class OrdersService {\n  constructor(private readonly dataSource: DataSource) {}\n\n  async placeOrder(bookId: number, qty: number) {\n    return this.dataSource.transaction(async (manager) => {\n      const book = await manager.findOneOrFail('Book', { where: { id: bookId } });\n      if (book.stock < qty) throw new Error('موجودی کافی نیست');\n      book.stock -= qty;\n      await manager.save(book);\n      const order = manager.create('Order', { bookId, qty, total: book.price * qty });\n      return manager.save(order);\n    });\n  }\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/orders { bookId: 1, qty: 2 }", size: "210 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "placeOrder(1, 2)", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "BEGIN → SELECT ... FOR UPDATE", size: "70 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "UPDATE book SET stock=stock-2; INSERT INTO \"order\" ...", size: "130 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "COMMIT → 201 Created — سفارش", size: "240 B", color: "purple" }
        ],
        check: "دو درخواست سفارش هم‌زمان برای آخرین موجودی یک کتاب بفرست؛ فقط یکی باید موفق شود و موجودی هرگز منفی نشود."
      }
    ]
  },
  {
    id: 3, title: "Drizzle ORM", sub: "Schema-first، کوئری، Relations، Migration، مقایسه با TypeORM",
    steps: [
      {
        id: "3.1", title: "نصب و schema-first",
        goal: "همان جدول‌های NestShop را این بار با Drizzle و به سبک schema-first تعریف کن.",
        intro: [
          "Drizzle برعکس TypeORM است: به‌جای کلاس و دکوراتور، اسکیما فقط یک آبجکت TypeScript است — ‎pgTable('book', { ... })‎. بدون magic، بدون Reflect Metadata؛ چیزی که می‌نویسی همان چیزی است که اجرا می‌شود.",
          "در NestShop یک ماژول دوم می‌سازیم (DrizzleModule) که کنار TypeORM زندگی می‌کند تا آخر فصل، هر دو را روی یک دیتابیس مقایسه کنیم."
        ],
        facts: [["پکیج", "drizzle-orm + pg"], ["تعریف جدول", "pgTable"], ["بدون دکوراتور", "فقط توابع و تایپ‌ها"]],
        callout: { label: "تفاوت ذهنی", code: "TypeORM: کلاس + دکوراتور → جدول\nDrizzle: تابع pgTable → جدول + تایپ خودکار" },
        code: [{ path: "src/drizzle/schema.ts", lang: "ts", code: `import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';\n\nexport const authors = pgTable('author', {\n  id: serial('id').primaryKey(),\n  name: varchar('name', { length: 120 }).notNull(),\n});\n\nexport const books = pgTable('book', {\n  id: serial('id').primaryKey(),\n  title: varchar('title', { length: 200 }).notNull(),\n  price: integer('price').notNull(),\n  stock: integer('stock').notNull().default(0),\n  authorId: integer('author_id').references(() => authors.id),\n  createdAt: timestamp('created_at').defaultNow(),\n});` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "findAll() — Drizzle", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "db.select().from(books)", size: "60 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "select * from \"book\"", size: "60 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK", size: "410 B", color: "purple" }
        ],
        check: "اسکیمای Drizzle را بنویس و تایپ خروجی select را در ادیتور هاور کن؛ باید Book کامل با تایپ درست دیده شود، بدون هیچ any."
      },
      {
        id: "3.2", title: "کوئری‌ها و Relations",
        goal: "با API رابطه‌ای Drizzle، کتاب را همراه نویسنده‌اش بگیر.",
        intro: [
          "در Drizzle رابطه‌ها را جداگانه با ‎relations()‎ تعریف می‌کنی و بعد با ‎db.query.books.findMany({ with: { author: true } })‎ می‌گیری. نتیجه تایپ‌دار است و کوئری دوم خودکار زده می‌شود.",
          "دو سبک کوئری دارد: relational (خوانا، شبیه ORM) و core (‎select().from().where()‎ — نزدیک SQL). هر دو را در NestShop می‌بینی."
        ],
        facts: [["رابطه‌ای", "db.query.books.findMany({ with })"], ["هسته", "db.select().from(books).where(eq(...))"], ["عملگرها", "eq, lt, like, and, or از drizzle-orm"]],
        callout: { label: "نکته‌ی تایپ", code: "typeof books.$inferSelect → تایپ ردیف\ntypeof books.$inferInsert → تایپ ورودی insert" },
        code: [{ path: "src/drizzle/books-drizzle.service.ts", lang: "ts", code: `import { Injectable, Inject } from '@nestjs/common';\nimport { eq, lt } from 'drizzle-orm';\nimport { books } from './schema';\nimport { DRIZZLE } from './drizzle.module';\n\n@Injectable()\nexport class BooksDrizzleService {\n  constructor(@Inject(DRIZZLE) private readonly db: any) {}\n\n  findCheap(maxPrice: number) {\n    return this.db.select().from(books).where(lt(books.price, maxPrice));\n  }\n\n  findAllWithAuthor() {\n    return this.db.query.books.findMany({ with: { author: true } });\n  }\n\n  create(data: typeof books.$inferInsert) {\n    return this.db.insert(books).values(data).returning();\n  }\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books?maxPrice=500000", size: "200 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "findCheap(500000)", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "select().from(books).where(price < 500000)", size: "80 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "select ... from \"book\" where \"price\" < $1", size: "80 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK — کتاب‌های ارزان", size: "380 B", color: "purple" }
        ],
        check: "یک کوئری بنویس: کتاب‌های موجود (stock > 0) با قیمت زیر ۵۰۰ هزار، مرتب بر اساس قیمت. SQL تولیدشده را با console.log ببین."
      },
      {
        id: "3.3", title: "Migration با drizzle-kit",
        goal: "اسکیما را با drizzle-kit به SQL تبدیل و روی دیتابیس اعمال کن.",
        intro: [
          "drizzle-kit از روی schema.ts فایل SQL می‌سازد (‎generate‎) و با ‎migrate‎ اجرا می‌کند. فایل‌های SQL در پوشه‌ی drizzle/ می‌مانند و در گیت کامیت می‌شوند — قابل خواندن و قابل بازبینی.",
          "مزیت بزرگ: Migration نهایی یک SQL ساده است؛ اگر چیزی اشتباه بود، همان فایل را دستی اصلاح می‌کنی. هیچ SQL پنهانی وجود ندارد."
        ],
        facts: [["ساخت", "drizzle-kit generate"], ["اجرا", "drizzle-kit migrate"], ["پوشه‌ی خروجی", "drizzle/ — فایل‌های .sql"]],
        callout: { label: "دستورها", code: "$ npx drizzle-kit generate\n$ npx drizzle-kit migrate" },
        code: [{ path: "drizzle/0001_add_isbn.sql", lang: "sql", code: `ALTER TABLE "book" ADD COLUMN "isbn" varchar(17);` }],
        hops: [
          { from: "client", to: "controller", type: "CLI", info: "drizzle-kit generate", size: "—", color: "blue" },
          { from: "controller", to: "service", type: "File", info: "drizzle/0001_add_isbn.sql ساخته شد", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "drizzle-kit migrate", size: "—", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "ALTER TABLE book ADD isbn + ثبت migration", size: "70 B", color: "green" }
        ],
        check: "ستون isbn را به اسکیما اضافه کن، generate بزن و فایل SQL ساخته‌شده را بخوان؛ بعد migrate کن و ستون را در psql ببین."
      },
      {
        id: "3.4", title: "مقایسه مستقیم با TypeORM در همان پروژه",
        goal: "یک اندپوینت را با هر دو ORM بنویس و تفاوت واقعی را لمس کن.",
        intro: [
          "حالا NestShop دو مسیر دارد: ‎/books/typeorm‎ و ‎/books/drizzle‎. هر دو همان داده را برمی‌گردانند، ولی کدشان فرق می‌کند.",
          "TypeORM: کوتاه‌تر برای CRUD ساده، ولی magic بیشتر (دکوراتور، Reflect، lazy loading). Drizzle: صریح‌تر و نزدیک‌تر به SQL، تایپ دقیق‌تر، باندل سبک‌تر؛ ولی برای هر رابطه باید relations را خودت تعریف کنی."
        ],
        facts: [["TypeORM", "کلاس‌محور، Repository، magic بیشتر"], ["Drizzle", "تابع‌محور، نزدیک SQL، تایپ دقیق"], ["نتیجه‌ی یکسان", "هر دو همان ردیف‌های Postgres"]],
        callout: { label: "معیار مقایسه", code: "خوانایی کد · دقت تایپ · کنترل روی SQL · اندازه‌ی باندل · منحنی یادگیری" },
        code: [{ path: "src/books/books.controller.ts", lang: "ts", code: `// همان مسیر، دو پیاده‌سازی — خروجی یکی است\n@Get('typeorm')\nbyTypeOrm() { return this.typeormService.findAll(); }\n\n@Get('drizzle')\nbyDrizzle() { return this.drizzleService.findAllWithAuthor(); }` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books/typeorm", size: "190 B", color: "blue" },
          { from: "controller", to: "service", type: "ORM", info: "TypeORM Repository.find()", size: "—", color: "green" },
          { from: "service", to: "db", type: "SQL", info: "SELECT ... FROM book", size: "64 B", color: "teal" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK", size: "410 B", color: "purple" },
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books/drizzle → همان خروجی", size: "190 B", color: "blue" }
        ],
        check: "هر دو اندپوینت را صدا بزن و خروجی‌ها را diff بگیر؛ باید عین هم باشند. بعد زمان پاسخ هر کدام را سه بار اندازه بگیر."
      },
      {
        id: "3.5", title: "انتخاب: کدام بخش با کدام ORM",
        goal: "تصمیم بگیر NestShop کدام بخش را با کدام ORM نگه دارد — و چرا.",
        intro: [
          "جواب «همیشه یکی» نیست. در NestShop تصمیم ما: TypeORM برای بخش سفارش (تراکنش و Entityهای به‌هم‌پیوسته راحت‌تر است) و Drizzle برای گزارش‌گیری و جستجوی کتاب (کنترل دقیق روی SQL و joinها ارزش دارد).",
          "مهم‌ترین اصل: یک جدول، یک مالک. هر جدول فقط از یک ORM نوشته شود؛ وگرنه دو Migration برای یک جدول، جنگ می‌شود."
        ],
        facts: [["سفارش", "TypeORM — تراکنش و روابط"], ["گزارش و جستجو", "Drizzle — کنترل SQL"], ["قانون", "هر جدول فقط یک ORM مالک دارد"]],
        callout: { label: "تصمیم NestShop", code: "orders, order_items → TypeORM\nbooks, authors (read/report) → Drizzle\nهرگز هر دو روی یک جدول write نزنند." },
        code: [{ path: "src/app.module.ts", lang: "ts", code: `imports: [\n  TypeOrmModule.forRoot({ /* ... */ }),\n  DrizzleModule, // فقط برای read/report کتاب‌ها\n  BooksModule,\n  OrdersModule,\n]` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/reports/top-books", size: "200 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "گزارش پرفروش‌ترین‌ها", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "Drizzle: groupBy + sum + orderBy", size: "110 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "SELECT book_id, sum(qty) ... GROUP BY ... ORDER BY ... LIMIT 10", size: "130 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK — گزارش", size: "460 B", color: "purple" }
        ],
        check: "روی کاغذ (یا در README پروژه) بنویس: هر جدول NestShop مالک کدام ORM است و چرا. اگر جواب «هر دو» شد، دوباره فکر کن."
      }
    ]
  }
);
/* ---- فصل ۴ و ۵ ---- */
COURSE.chapters.push(
  {
    id: 4, title: "Zod", sub: "اسکیما، ZodValidationPipe، خطاها، مقایسه با class-validator",
    steps: [
      {
        id: "4.1", title: "اسکیمای Zod برای DTO",
        goal: "ورودی ساخت کتاب را با Zod تعریف کن؛ تایپ، خودش از اسکیما درمی‌آید.",
        intro: [
          "Zod یک کتابخانه‌ی اعتبارسنجی schema-first است: اسکیما را می‌نویسی و تایپ TypeScript با ‎z.infer‎ خودکار ساخته می‌شود. یعنی DTO و اعتبارسنجی یک منبع حقیقت دارند و هرگز از هم جدا نمی‌شوند.",
          "در NestShop، ساخت کتاب قوانین روشنی دارد: عنوان حداقل ۳ حرف، قیمت عدد مثبت، موجودی عدد صحیح صفر یا بیشتر، isbn اختیاری با فرمت درست."
        ],
        facts: [["پکیج", "zod"], ["تایپ از اسکیما", "z.infer<typeof schema>"], ["پیام فارسی", "هر فیلد errorMap خودش را دارد"]],
        callout: { label: "اصل Zod", code: "یک اسکیما بنویس → تایپ رایگان بگیر → ورودی را parse کن → یا داده‌ی سالم، یا خطای دقیق." },
        code: [{ path: "src/books/dto/create-book.schema.ts", lang: "ts", code: `import { z } from 'zod';\n\nexport const CreateBookSchema = z.object({\n  title: z.string().min(3, 'عنوان حداقل ۳ حرف باشد'),\n  authorName: z.string().min(2, 'نام نویسنده را بنویس'),\n  price: z.number().int().positive('قیمت باید عدد مثبت باشد'),\n  stock: z.number().int().min(0).default(0),\n  isbn: z.string().regex(/^[0-9-]{10,17}$/, 'ISBN معتبر نیست').optional(),\n});\n\nexport type CreateBookDto = z.infer<typeof CreateBookSchema>;` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/books { title: 'X', price: -5 }", size: "230 B", color: "blue" },
          { from: "controller", to: "service", type: "Pipe", info: "Zod parse: price منفی → خطا", size: "—", color: "amber" },
          { from: "service", to: "client", type: "HTTP", info: "400 — قیمت باید عدد مثبت باشد", size: "240 B", color: "purple" }
        ],
        check: "اسکیما را بنویس و در node با چند ورودی درست و غلط تست کن: safeParse باید برای ورودی بد، success: false بدهد."
      },
      {
        id: "4.2", title: "ساخت ZodValidationPipe",
        goal: "یک Pipe سفارشی بنویس که هر اسکیمای Zod را به Nest وصل کند.",
        intro: [
          "Nest نمی‌داند Zod چیست؛ Pipe پل بین آن‌هاست. ZodValidationPipe اسکیما را در constructor می‌گیرد، در transform ورودی را parse می‌کند و اگر خطا بود BadRequestException پرتاب می‌کند.",
          "زیبایی این روش: یک Pipe برای همه‌ی اندپوینت‌ها. هر کنترلر فقط می‌گوید «اسکیمای من این است» و بقیه‌اش خودکار است."
        ],
        facts: [["رابط", "PipeTransform"], ["خطا", "BadRequestException با جزئیات فیلد"], ["استفاده", "@Body(new ZodValidationPipe(CreateBookSchema))"]],
        callout: { label: "شکل خطای ۴۰۰", code: "{\n  \"statusCode\": 400,\n  \"message\": [\n    { \"field\": \"price\", \"message\": \"قیمت باید عدد مثبت باشد\" }\n  ]\n}" },
        code: [{ path: "src/common/pipes/zod-validation.pipe.ts", lang: "ts", code: `import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';\nimport { ZodSchema } from 'zod';\n\n@Injectable()\nexport class ZodValidationPipe implements PipeTransform {\n  constructor(private readonly schema: ZodSchema) {}\n\n  transform(value: unknown) {\n    const result = this.schema.safeParse(value);\n    if (!result.success) {\n      throw new BadRequestException(\n        result.error.issues.map((i) => ({\n          field: i.path.join('.'),\n          message: i.message,\n        })),\n      );\n    }\n    return result.data;\n  }\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/books — بدنه‌ی ناقص", size: "220 B", color: "blue" },
          { from: "controller", to: "service", type: "Pipe", info: "ZodValidationPipe.safeParse → خطا", size: "—", color: "amber" },
          { from: "service", to: "client", type: "HTTP", info: "400 — لیست خطاها به‌ازای هر فیلد", size: "300 B", color: "purple" },
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/books — بدنه‌ی سالم", size: "260 B", color: "blue" },
          { from: "controller", to: "service", type: "Pipe", info: "parse موفق → داده‌ی تمیز به سرویس", size: "—", color: "green" }
        ],
        check: "Pipe را روی POST /books بگذار و سه ورودی بد بفرست (قیمت منفی، عنوان خالی، isbn اشتباه)؛ هر بار باید نام فیلد و پیام فارسی دقیق برگردد."
      },
      {
        id: "4.3", title: "خطاهای فارسی و پیام‌های دقیق",
        goal: "خطای اعتبارسنجی را آن‌قدر دقیق کن که کاربر بداند دقیقاً چه چیزی را اصلاح کند.",
        intro: [
          "خطای خوب سه چیز دارد: کدام فیلد، چرا، و چه چیزی قابل قبول است. «ورودی نامعتبر است» هیچ‌کدام را نمی‌گوید؛ «قیمت باید عدد مثبت باشد» هر سه را می‌گوید.",
          "در Zod پیام را همان‌جا که قانون را می‌نویسی، مشخص می‌کنی. برای پیام‌های سراسری فارسی هم می‌توانی z.setErrorMap را یک بار در main.ts تنظیم کنی."
        ],
        facts: [["پیام هر قانون", "دومین آرگومان هر متد"], ["نقشه‌ی سراسری", "z.setErrorMap در main.ts"], ["فیلد", "issue.path — مثلا ['items', 0, 'qty']"]],
        callout: { label: "خطای بد در برابر خوب", code: "بد:  { \"message\": \"Bad Request\" }\nخوب: { \"field\": \"items.0.qty\", \"message\": \"تعداد حداقل ۱ باشد\" }" },
        code: [{ path: "src/main.ts", lang: "ts", code: `import { z } from 'zod';\n\nz.setErrorMap((issue, ctx) => {\n  if (issue.code === z.ZodIssueCode.invalid_type) {\n    return { message: 'نوع این فیلد درست نیست' };\n  }\n  return { message: ctx.defaultError };\n});` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/orders { qty: 0 }", size: "200 B", color: "blue" },
          { from: "controller", to: "service", type: "Pipe", info: "Zod: qty.min(1) رد شد", size: "—", color: "amber" },
          { from: "service", to: "client", type: "HTTP", info: "400 — { field: 'qty', message: 'تعداد حداقل ۱ باشد' }", size: "260 B", color: "purple" }
        ],
        check: "برای سفارش یک اسکیما بنویس که qty حداقل ۱ و bookId عدد صحیح مثبت باشد؛ خطای هر فیلد را جداگانه تست کن."
      },
      {
        id: "4.4", title: "Zod در برابر class-validator",
        goal: "بدانی کِی Zod ببری و کِی class-validator؛ و چرا NestShop هر دو را نگه می‌دارد.",
        intro: [
          "class-validator راه رسمی Nest است: DTO یک کلاس با دکوراتور است و ValidationPipe آن را می‌خواند. Zod راه schema-first است: DTO یک آبجکت است و تایپ از آن ساخته می‌شود.",
          "تفاوت عملی: در class-validator تایپ و اعتبارسنجی دو جای جدا هستند و می‌توانند از هم جدا شوند؛ در Zod یک منبع حقیقت است. اما class-validator با اکوسیستم Nest (مثل Swagger) یکپارچه‌تر است."
        ],
        facts: [["class-validator", "کلاس + دکوراتور، رسمی Nest"], ["Zod", "اسکیما + infer، یک منبع حقیقت"], ["Swagger", "با class-validator خودکار بهتر است"]],
        callout: { label: "تصمیم NestShop", code: "ورودی‌های API عمومی → Zod (پیام فارسی دقیق)\nDTOهایی که در Swagger مستند می‌شوند → class-validator" },
        code: [{ path: "src/books/dto/create-book.dto.ts", lang: "ts", code: `// class-validator — همان DTO به سبک رسمی Nest\nimport { IsInt, IsPositive, IsString, MinLength } from 'class-validator';\n\nexport class CreateBookDto {\n  @IsString() @MinLength(3)\n  title: string;\n\n  @IsInt() @IsPositive()\n  price: number;\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/books — هر دو روش", size: "230 B", color: "blue" },
          { from: "controller", to: "service", type: "Pipe", info: "Zod pipe یا ValidationPipe — نتیجه یکی", size: "—", color: "green" },
          { from: "service", to: "client", type: "HTTP", info: "201 یا 400 — بسته به ورودی", size: "250 B", color: "purple" }
        ],
        check: "همان DTO ساخت کتاب را به هر دو سبک بنویس و مقایسه کن: کدام کوتاه‌تر است؟ کدام را راحت‌تر می‌خوانی؟ جواب را در README بنویس."
      },
      {
        id: "4.5", title: "ترکیب Zod با TypeORM و Drizzle",
        goal: "ورودیِ اعتبارسنجی‌شده‌ی Zod را مستقیم به لایه‌ی داده بده، بدون تبدیل دستی.",
        intro: [
          "نقطه‌ی اتصال اینجاست: خروجی ZodValidationPipe یک آبجکت تمیز و تایپ‌دار است. سرویس همان را به ‎repository.save‎ در TypeORM یا ‎db.insert‎ در Drizzle می‌دهد — بدون اینکه دوباره فیلدها را بردارد و بچیند.",
          "نکته‌ی ظریف: تایپ خروجی Zod با ‎$inferInsert‎ در Drizzle و با Entity در TypeORM یکی نیست؛ سرویس یک تبدیل کوچک و صریح انجام می‌دهد و همان‌جا تست می‌شود."
        ],
        facts: [["ورودی تمیز", "خروجی Pipe — تایپ‌دار"], ["TypeORM", "repository.save(dto)"], ["Drizzle", "db.insert(books).values(dto)"]],
        callout: { label: "جریان کامل", code: "HTTP body → ZodValidationPipe → DTO تمیز → Service → TypeORM/Drizzle → Postgres" },
        code: [{ path: "src/books/books.service.ts", lang: "ts", code: `import { Injectable } from '@nestjs/common';\nimport { CreateBookDto } from './dto/create-book.schema';\n\n@Injectable()\nexport class BooksService {\n  // dto همین‌جا تایپ‌دار و اعتبارسنجی‌شده رسیده است\n  create(dto: CreateBookDto) {\n    return this.books.save({\n      title: dto.title,\n      authorName: dto.authorName,\n      price: dto.price,\n      stock: dto.stock ?? 0,\n    });\n  }\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/books — بدنه‌ی سالم", size: "260 B", color: "blue" },
          { from: "controller", to: "service", type: "Pipe", info: "Zod parse موفق → DTO تمیز", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "save(dto) → INSERT", size: "120 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "INSERT INTO book ... RETURNING id", size: "120 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "201 Created", size: "230 B", color: "purple" }
        ],
        check: "یک کتاب با بدنه‌ی سالم بساز و در دیتابیس چک کن ردیف ساخته شده؛ بعد همان درخواست را با یک فیلد اضافه (مثلا admin: true) بفرست و ببین whitelist/Zod آن را حذف می‌کند یا نه."
      }
    ]
  },
  {
    id: 5, title: "Prisma", sub: "Schema، PrismaClient، Migration، Relations، جدول تصمیم‌گیری",
    steps: [
      {
        id: "5.1", title: "schema.prisma و PrismaClient",
        goal: "مدل‌های NestShop را در schema.prisma تعریف کن و PrismaClient را به Nest وصل کن.",
        intro: [
          "Prisma راه سوم است: مدل‌ها را در یک فایل ‎schema.prisma‎ با زبان مخصوص خودش می‌نویسی، Prisma Client را تولید می‌کنی (‎prisma generate‎) و بعد با یک کلاینت تایپ‌دار کوئری می‌زنی.",
          "PrismaService در Nest یک سرویس ساده است که PrismaClient را extend می‌کند و در onModuleInit وصل و در onModuleDestroy قطع می‌شود."
        ],
        facts: [["فایل مدل", "prisma/schema.prisma"], ["تولید کلاینت", "npx prisma generate"], ["سرویس Nest", "PrismaService extends PrismaClient"]],
        callout: { label: "دستورها", code: "$ npm i prisma @prisma/client\n$ npx prisma init\n$ npx prisma generate" },
        code: [{ path: "prisma/schema.prisma", lang: "prisma", code: `generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel Author {\n  id    Int    @id @default(autoincrement())\n  name  String\n  books Book[]\n}\n\nmodel Book {\n  id         Int      @id @default(autoincrement())\n  title      String\n  price      Int\n  stock      Int      @default(0)\n  authorId   Int\n  author     Author   @relation(fields: [authorId], references: [id])\n  createdAt  DateTime @default(now())\n}` }],
        hops: [
          { from: "client", to: "controller", type: "CLI", info: "prisma generate — ساخت کلاینت", size: "—", color: "blue" },
          { from: "controller", to: "service", type: "Init", info: "PrismaService: $connect در onModuleInit", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "PrismaClient آماده‌ی کوئری", size: "—", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "اتصال به Postgres برقرار شد", size: "—", color: "green" }
        ],
        check: "schema.prisma را بنویس و generate کن؛ در ادیتور prisma.book. را تایپ کن و ببین autocomplete همه‌ی متدها را نشان می‌دهد."
      },
      {
        id: "5.2", title: "CRUD با Prisma",
        goal: "همه‌ی عملیات کتاب را با Prisma Client بنویس؛ بدون SQL دستی.",
        intro: [
          "API پریسما خوانا است: ‎findMany‎، ‎findUnique‎، ‎create‎، ‎update‎، ‎delete‎. فیلترها با ‎where‎، مرتب‌سازی با ‎orderBy‎ و صفحه‌بندی با ‎skip/take‎ انجام می‌شود.",
          "تفاوت مهم با TypeORM: در Prisma رابطه‌ها را با ‎include‎ می‌گیری و نتیجه همیشه آبجکت ساده‌ی جاوااسکریپت است — نه نمونه‌ی کلاس Entity."
        ],
        facts: [["خواندن", "findMany / findUnique"], ["نوشتن", "create / update / delete"], ["رابطه", "include: { author: true }"]],
        callout: { label: "خروجی", code: "Prisma همیشه plain object برمی‌گرداند — برای JSON آماده است." },
        code: [{ path: "src/books/books-prisma.service.ts", lang: "ts", code: `import { Injectable } from '@nestjs/common';\nimport { PrismaService } from '../prisma/prisma.service';\n\n@Injectable()\nexport class BooksPrismaService {\n  constructor(private readonly prisma: PrismaService) {}\n\n  findAll() {\n    return this.prisma.book.findMany({ include: { author: true } });\n  }\n\n  findOne(id: number) {\n    return this.prisma.book.findUnique({ where: { id }, include: { author: true } });\n  }\n\n  create(data: { title: string; price: number; authorId: number }) {\n    return this.prisma.book.create({ data });\n  }\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "findAll()", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "prisma.book.findMany({ include: { author: true } })", size: "90 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "SELECT ... FROM \"Book\" + کوئری Author", size: "120 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK", size: "420 B", color: "purple" }
        ],
        check: "سه متد CRUD را بنویس و با curl تست کن؛ خروجی include باید author را به‌صورت آبجکت تو در تو برگرداند."
      },
      {
        id: "5.3", title: "Relations و Include",
        goal: "رابطه‌های عمیق‌تر را با include و select کنترل کن.",
        intro: [
          "include یعنی «این رابطه را هم بیاور»، select یعنی «فقط این فیلدها را بیاور». ترکیبشان جلوی نشت داده را می‌گیرد: مثلا در لیست عمومی، ایمیل نویسنده را select نمی‌کنیم.",
          "برای سفارش‌ها، رابطه‌ی چندلایه است: Order → items → book → author. پریسما این زنجیره را در یک کوئری می‌سازد."
        ],
        facts: [["include", "لود رابطه"], ["select", "انتخاب فیلد"], ["زنجیره", "include تو در تو تا چند سطح"]],
        callout: { label: "قانون", code: "در API عمومی همیشه select/include را صریح بنویس؛ هرگز همه‌ی فیلدها را به‌صورت پیش‌فرض برنگردان." },
        code: [{ path: "src/orders/orders-prisma.service.ts", lang: "ts", code: `findOrderWithDetails(id: number) {\n  return this.prisma.order.findUnique({\n    where: { id },\n    include: {\n      items: {\n        include: { book: { select: { id: true, title: true, price: true } } },\n      },\n    },\n  });\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/orders/1", size: "186 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "findOrderWithDetails(1)", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "findUnique + include تو در تو", size: "110 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "چند SELECT هماهنگ برای Order/Item/Book", size: "160 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK — سفارش با اقلام و کتاب‌ها", size: "540 B", color: "purple" }
        ],
        check: "یک سفارش با دو قلم بساز و جزئیاتش را بگیر؛ در خروجی باید فقط id و title و price کتاب باشد، نه همه‌ی فیلدهایش."
      },
      {
        id: "5.4", title: "Migration و Prisma Studio",
        goal: "اسکیما را با migrate dev نسخه‌بندی کن و داده‌ها را در Studio ببین.",
        intro: [
          "‎prisma migrate dev‎ سه کار می‌کند: از schema.prisma تفاوت را می‌سازد، SQL را در prisma/migrations می‌نویسد و روی دیتابیس اعمال می‌کند. فایل‌های SQL در گیت می‌مانند.",
          "Prisma Studio یک داشبورد وب محلی است (‎npx prisma studio‎) که جدول‌ها را مثل spreadsheet نشان می‌دهد — برای دیدن داده‌ها موقع توسعه عالی است."
        ],
        facts: [["ساخت و اجرا", "prisma migrate dev --name add_isbn"], ["فقط SQL", "prisma migrate deploy (پروداکشن)"], ["داشبورد", "npx prisma studio"]],
        callout: { label: "پروداکشن", code: "در پروداکشن فقط migrate deploy بزن؛ هرگز migrate dev روی دیتابیس واقعی اجرا نکن." },
        code: [{ path: "terminal", lang: "bash", code: `$ npx prisma migrate dev --name add_isbn\n# Applying migration 20261117_add_isbn\n# Your database is now in sync with your schema.\n$ npx prisma studio  # → http://localhost:5555` }],
        hops: [
          { from: "client", to: "controller", type: "CLI", info: "prisma migrate dev --name add_isbn", size: "—", color: "blue" },
          { from: "controller", to: "service", type: "File", info: "prisma/migrations/xxx_add_isbn/migration.sql", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "اعمال migration", size: "—", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "ALTER TABLE + ثبت در _prisma_migrations", size: "70 B", color: "green" }
        ],
        check: "یک فیلد جدید به Book اضافه کن، migrate dev بزن و فایل SQL ساخته‌شده را بخوان؛ بعد Studio را باز کن و ردیف‌ها را ببین."
      },
      {
        id: "5.5", title: "جدول تصمیم‌گیری سه ORM",
        goal: "با یک جدول روشن، برای هر پروژه‌ی بعدی‌ات ORM درست را انتخاب کن.",
        intro: [
          "حالا هر سه را در یک پروژه لمس کرده‌ای. تصمیم دیگر سلیقه نیست؛ معیار است. جدول زیر خلاصه‌ی همان تجربه است — آن را در README پروژه‌ات نگه دار.",
          "تصمیم NestShop: Prisma برای CRUD اصلی و سفارش (سرعت توسعه و DX)، Drizzle برای گزارش‌ها (کنترل SQL)، TypeORM برای بخش‌هایی که از قبل با آن نوشته شده‌اند. سه ORM کنار هم، ولی هر جدول فقط یک مالک دارد."
        ],
        facts: [["سریع‌ترین شروع", "Prisma"], ["بیشترین کنترل SQL", "Drizzle"], ["بیشترین magic", "TypeORM"]],
        callout: { label: "جدول تصمیم‌گیری", code: "پروژه‌ی کوچک/استارتاپ → Prisma\nگزارش و کوئری سنگین → Drizzle\nتیم بزرگ با Entityهای پیچیده → TypeORM\nهر سه با هم → فقط با مالکیت جدول" },
        code: [{ path: "README.md — تصمیم NestShop", lang: "md", code: `# انتخاب ORM در NestShop\n\n| نیاز | انتخاب | چرا |\n| --- | --- | --- |\n| CRUD کتاب و سفارش | Prisma | سریع، تایپ‌دار، Studio |\n| گزارش پرفروش‌ترین‌ها | Drizzle | کنترل کامل SQL |\n| ماژول‌های قدیمی | TypeORM | بازنویسی نمی‌ارزد |\n\nقانون: هر جدول فقط یک ORM مالک دارد.` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books — سه پیاده‌سازی", size: "184 B", color: "blue" },
          { from: "controller", to: "service", type: "ORM", info: "Prisma / Drizzle / TypeORM — خروجی یکی", size: "—", color: "green" },
          { from: "service", to: "db", type: "SQL", info: "هر سه به همان جدول Postgres می‌رسند", size: "64 B", color: "teal" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK", size: "410 B", color: "purple" }
        ],
        check: "جدول تصمیم‌گیری را برای یک پروژه‌ی فرضی خودت پر کن (مثلا یک وبلاگ): کدام ORM را انتخاب می‌کنی و با چه دلیلی؟ سه خط بنویس."
      }
    ]
  }
);
/* ---- فصل ۶ ---- */
COURSE.chapters.push(
  {
    id: 6, title: "تکمیل پروژه واقعی", sub: "JWT، Pagination، تست، خطاها، دیپلوی",
    steps: [
      {
        id: "6.1", title: "Auth با JWT و Guard",
        goal: "ورود کاربر را با JWT بساز و مسیرهای مدیر را با Guard قفل کن.",
        intro: [
          "احراز هویت در NestShop دو تکه است: ‎/auth/login‎ که با نام کاربری و رمز، یک توکن JWT می‌دهد؛ و JwtAuthGuard که روی مسیرهای محافظت‌شده می‌نشیند و توکن را بررسی می‌کند.",
          "توکن را در هدر ‎Authorization: Bearer <token>‎ می‌فرستی. Guard آن را decode می‌کند و کاربر را روی request.user می‌گذارد تا کنترلر بداند چه کسی درخواست داده."
        ],
        facts: [["پکیج", "@nestjs/jwt + @nestjs/passport"], ["توکن", "JWT — امضاشده با secret"], ["هدر", "Authorization: Bearer <token>"]],
        callout: { label: "هشدار امنیتی", code: "JWT_SECRET را در ‎.env‎ بگذار و هرگز کامیت نکن. توکن را در localStorage فرانت‌اند نگه ندار؛ httpOnly cookie امن‌تر است." },
        code: [{ path: "src/auth/auth.service.ts", lang: "ts", code: `import { Injectable, UnauthorizedException } from '@nestjs/common';\nimport { JwtService } from '@nestjs/jwt';\n\n@Injectable()\nexport class AuthService {\n  constructor(private readonly jwt: JwtService) {}\n\n  async login(username: string, password: string) {\n    // در پروژه‌ی واقعی: رمز با bcrypt مقایسه می‌شود\n    if (username !== 'admin' || password !== 'secret') {\n      throw new UnauthorizedException('نام کاربری یا رمز اشتباه است');\n    }\n    const payload = { sub: 1, username, role: 'admin' };\n    return { access_token: await this.jwt.signAsync(payload) };\n  }\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/auth/login { admin, secret }", size: "220 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "login() — بررسی رمز", size: "—", color: "green" },
          { from: "service", to: "client", type: "HTTP", info: "200 OK — { access_token }", size: "260 B", color: "purple" },
          { from: "client", to: "controller", type: "HTTP", info: "POST /api/books + Bearer token", size: "280 B", color: "blue" },
          { from: "controller", to: "service", type: "Guard", info: "JwtAuthGuard: توکن معتبر → ادامه", size: "—", color: "teal" },
          { from: "service", to: "client", type: "HTTP", info: "201 Created", size: "230 B", color: "purple" }
        ],
        check: "لاگین کن، توکن را بگیر و با آن یک کتاب بساز؛ بعد بدون توکن همان درخواست را بفرست و ۴۰۱ را ببین."
      },
      {
        id: "6.2", title: "Pagination و Search",
        goal: "لیست کتاب‌ها را صفحه‌بندی و قابل جستجو کن؛ مثل داشبوردهای واقعی.",
        intro: [
          "هیچ API واقعی‌ای هزار ردیف را یک‌جا برنمی‌گرداند. قرارداد NestShop: ‎?page=2&limit=10&q=clean‎. پاسخ علاوه بر data، یک آبجکت meta دارد: total، page، limit و totalPages.",
          "جستجو با ‎ILIKE‎ در Postgres انجام می‌شود (بدون حساسیت به حروف) و صفحه‌بندی با ‎skip/take‎ در Prisma یا ‎offset/limit‎ در QueryBuilder."
        ],
        facts: [["پارامترها", "?page&limit&q"], ["پاسخ", "{ data, meta: { total, page, limit, totalPages } }"], ["جستجو", "ILIKE %q% روی title"]],
        callout: { label: "نمونه‌ی پاسخ", code: "GET /api/books?page=2&limit=10&q=clean\n{\n  \"data\": [ ... 10 کتاب ... ],\n  \"meta\": { \"total\": 47, \"page\": 2, \"limit\": 10, \"totalPages\": 5 }\n}" },
        code: [{ path: "src/books/books-prisma.service.ts", lang: "ts", code: `async findPaginated(page = 1, limit = 10, q = '') {\n  const where = q\n    ? { title: { contains: q, mode: 'insensitive' as const } }\n    : {};\n  const [data, total] = await Promise.all([\n    this.prisma.book.findMany({ where, skip: (page - 1) * limit, take: limit }),\n    this.prisma.book.count({ where }),\n  ]);\n  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books?page=2&limit=10&q=clean", size: "220 B", color: "blue" },
          { from: "controller", to: "service", type: "Call", info: "findPaginated(2, 10, 'clean')", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "findMany + count — موازی", size: "100 B", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "SELECT ... WHERE title ILIKE '%clean%' LIMIT 10 OFFSET 10", size: "120 B", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK — { data, meta }", size: "480 B", color: "purple" }
        ],
        check: "صفحه‌ی ۲ را با limit=5 بگیر و meta را چک کن؛ بعد q را عوض کن و ببین total عوض می‌شود یا نه."
      },
      {
        id: "6.3", title: "تست واحد و e2e",
        goal: "برای سرویس کتاب تست واحد و برای کل API تست e2e بنویس.",
        intro: [
          "تست واحد سرویس را جدا تست می‌کند: Repository را mock می‌کنی و فقط منطق سرویس را چک می‌کنی. تست e2e کل مسیر HTTP را با supertest می‌زند: از کنترلر تا دیتابیس تست.",
          "در Nest، ‎Test.createTestingModule‎ ماژول را با وابستگی‌های قلابی می‌سازد. همین DI که فصل ۱ یاد گرفتی، حالا تست را ممکن می‌کند."
        ],
        facts: [["تست واحد", "Jest — سرویس با Repository قلابی"], ["تست e2e", "supertest — درخواست واقعی HTTP"], ["دیتابیس تست", "جدا از دیتابیس توسعه"]],
        callout: { label: "دستور", code: "$ npm test          # تست‌های واحد\n$ npm run test:e2e  # تست سرتاسری" },
        code: [{ path: "src/books/books.service.spec.ts", lang: "ts", code: `import { Test } from '@nestjs/testing';\nimport { BooksService } from './books.service';\nimport { getRepositoryToken } from '@nestjs/typeorm';\nimport { Book } from './entities/book.entity';\n\ndescribe('BooksService', () => {\n  it('findAll باید کتاب‌ها را برگرداند', async () => {\n    const repo = { find: jest.fn().mockResolvedValue([{ id: 1, title: 'Clean Code' }]) };\n    const module = await Test.createTestingModule({\n      providers: [\n        BooksService,\n        { provide: getRepositoryToken(Book), useValue: repo },\n      ],\n    }).compile();\n    const service = module.get(BooksService);\n    expect(await service.findAll()).toHaveLength(1);\n  });\n});` }],
        hops: [
          { from: "client", to: "controller", type: "Test", info: "jest — BooksService.findAll", size: "—", color: "blue" },
          { from: "controller", to: "service", type: "Mock", info: "Repository قلابی: find → یک کتاب", size: "—", color: "green" },
          { from: "service", to: "client", type: "Test", info: "PASS — toHaveLength(1)", size: "—", color: "teal" },
          { from: "client", to: "controller", type: "Test", info: "supertest — GET /api/books → 200", size: "184 B", color: "blue" }
        ],
        check: "یک تست واحد برای findOne بنویس که حالت ۴۰۴ را هم چک کند؛ بعد npm test را بزن و ببین سبز می‌شود یا نه."
      },
      {
        id: "6.4", title: "خطاها و لاگ",
        goal: "خطاها را یکدست کن و لاگ‌ها را طوری بنویس که در پروداکشن به درد بخورند.",
        intro: [
          "در فصل ۱ فیلتر خطا را ساختی؛ حالا آن را کامل می‌کنیم: خطای اعتبارسنجی Zod، خطای ۴۰۴ دیتابیس، و خطای ۵۰۰ پیش‌بینی‌نشده — هر سه یک شکل JSON دارند و هیچ stack trace به کلاینت نمی‌رسد.",
          "لاگ با Logger داخلی Nest انجام می‌شود: هر درخواست با متد، مسیر و زمان پاسخ لاگ می‌خورد. در پروداکشن این لاگ‌ها تنها چیزی هستند که برای دیباگ داری."
        ],
        facts: [["لاگر", "Logger از @nestjs/common"], ["لاگ درخواست", "Interceptor یا Middleware"], ["محرمانه", "هرگز رمز و توکن را لاگ نکن"]],
        callout: { label: "نمونه‌ی لاگ", code: "[Nest] LOG  GET /api/books 200 — 12ms\n[Nest] ERROR  POST /api/orders 500 — موجودی کافی نیست" },
        code: [{ path: "src/common/interceptors/logging.interceptor.ts", lang: "ts", code: `import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';\nimport { Observable, tap } from 'rxjs';\n\n@Injectable()\nexport class LoggingInterceptor implements NestInterceptor {\n  private readonly logger = new Logger('HTTP');\n\n  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {\n    const req = ctx.switchToHttp().getRequest();\n    const start = Date.now();\n    return next.handle().pipe(\n      tap(() => this.logger.log(req.method + ' ' + req.url + ' — ' + (Date.now() - start) + 'ms')),\n    );\n  }\n}` }],
        hops: [
          { from: "client", to: "controller", type: "HTTP", info: "GET /api/books", size: "184 B", color: "blue" },
          { from: "controller", to: "service", type: "Log", info: "LoggingInterceptor: شروع — زمان‌سنج", size: "—", color: "green" },
          { from: "service", to: "db", type: "SQL", info: "SELECT ... FROM book", size: "64 B", color: "teal" },
          { from: "db", to: "client", type: "HTTP", info: "200 OK — لاگ: GET /api/books — 12ms", size: "410 B", color: "purple" }
        ],
        check: "LoggingInterceptor را ثبت کن و پنج درخواست بزن؛ در ترمینال باید برای هر کدام یک خط با زمان پاسخ ببینی."
      },
      {
        id: "6.5", title: "دیپلوی",
        goal: "NestShop را build کن و روی یک سرور واقعی بالا بیاور.",
        intro: [
          "دیپلوی یعنی سه کار: build گرفتن (‎npm run build‎ → پوشه‌ی dist)، متغیرهای محیطی را روی سرور تنظیم کردن (DATABASE_URL و JWT_SECRET)، و Migrationها را قبل از استارت اجرا کردن (‎prisma migrate deploy‎).",
          "ترتیب مهم است: اول Migration، بعد استارت. اگر سرور قبل از Migration بالا بیاید، با اسکیمای قدیمی به جدول جدید کوئری می‌زند و ۵۰۰ می‌دهد."
        ],
        facts: [["بیلد", "npm run build → dist/"], ["استارت", "node dist/main"], ["مایگریشن پروداکشن", "prisma migrate deploy"], ["متغیرها", "روی سرور، نه در کد"]],
        callout: { label: "چک‌لیست دیپلوی", code: "1. npm run build\n2. prisma migrate deploy\n3. node dist/main\n4. curl سلامت: GET /api/books" },
        code: [{ path: "terminal", lang: "bash", code: `$ npm run build\n$ npx prisma migrate deploy\n$ NODE_ENV=production node dist/main\n# [Nest] LOG  Nest application successfully started\n$ curl https://api.nestshop.example/api/books` }],
        hops: [
          { from: "client", to: "controller", type: "Build", info: "npm run build → dist/", size: "—", color: "blue" },
          { from: "controller", to: "service", type: "Migrate", info: "prisma migrate deploy", size: "—", color: "green" },
          { from: "service", to: "repo", type: "ORM", info: "node dist/main — اتصال به Postgres پروداکشن", size: "—", color: "teal" },
          { from: "repo", to: "db", type: "SQL", info: "سلامت دیتابیس OK", size: "—", color: "green" },
          { from: "db", to: "client", type: "HTTP", info: "GET /api/books → 200 OK — زنده است", size: "410 B", color: "purple" }
        ],
        check: "پروژه را build کن و dist را اجرا کن (نه حالت dev)؛ GET /books باید از نسخه‌ی buildشده جواب بدهد. این یعنی دوره تمام شد — تبریک."
      }
    ]
  }
);

/* derived helpers */
COURSE.allSteps = COURSE.chapters.flatMap((c) => c.steps.map((s) => ({ ...s, chapter: c.id, chapterTitle: c.title })));
COURSE.totalSteps = COURSE.allSteps.length;
