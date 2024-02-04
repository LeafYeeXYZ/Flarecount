# Flarecount

**基于 `Cloudflare Workers` 和 `D1` 的网站访问量统计工具，可从 `busuanzi` 无缝切换**

> 本项目源自[yestool/analytics_with_cloudflare](https://github.com/yestool/analytics_with_cloudflare)，在此基础上添加了 `site_pv` 和 `site_uv` 的统计功能、修改了前端的引入方法，从而能从 `busuanzi` 无缝切换、汉化了 `README.md`

## 服务端部署

### 安装 wrangler

```bash
npm install wrangler
```

### 登陆 Cloudflare

```bash
npx wrangler login
```

### 创建数据库

```bash
npx wrangler d1 create <DATABASE_NAME>
```

成功示例

```bash
✅ Successfully created DB '<DATABASE_NAME>'

[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "<DATABASE_NAME>"
database_id = "<unique-ID-for-your-database>"
```

### 绑定 D1 数据库

用上面的内容替换 `wrangler.toml` 中的对应部分

```bash
[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "<DATABASE_NAME>"
database_id = "<unique-ID-for-your-database>"
```

### 初始化数据库

```bash
npm run initSql
```

### 部署到 Cloudflare Workers

```bash
npm run deploy
```

**成功示例**

```bash
 ⛅️ wrangler 3.26.0
-------------------
Your worker has access to the following bindings:
- D1 Databases:
  - DB: xxx (xxxxxxxxxxxxxxxxxxx)
Total Upload: 58.60 KiB / gzip: 13.92 KiB
Uploaded flarecount (1.84 sec)
Published flarecount (3.99 sec)
  https://flarecount.xxxxx.workers.dev
Current Deployment ID: xxxxxxxxxxxxxxxxxx
```

## 客户端部署

### 直接引入

引入 `flarecount.js`

```html
<script defer src="xxxxx/flarecount.js" data-base-url="https://flarecount.xxx.workers.dev"></script>
<!-- 推荐使用自定义域名 -->
```

展示数据

```html
<p>网站总访问量为<span id="site_pv"></span></p>
<p>网站访问用户有<span id="site_uv"></span></p>
<p>本页总访问量为<span id="page_pv"></span></p>
<p>本页访问用户有<span id="page_uv"></span></p>
```

### 兼容不蒜子

引入 `flarecount.js`

```html
<script defer src="xxxxx/flarecount.js" data-base-url="https://flarecount.xxx.workers.dev" data-busuanzi-mode="true"></script>
<!-- 推荐使用自定义域名 -->
```

展示数据

```html
<p>网站总访问量为<span id="busuanzi_value_site_pv"></span></p>
<p>网站访问用户有<span id="busuanzi_value_site_uv"></span></p>
<p>本页总访问量为<span id="busuanzi_value_page_pv"></span></p>
<p>本页访问用户有<span id="busuanzi_value_page_uv"></span></p>
```
