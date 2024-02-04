import { Hono } from 'hono';
import { cors } from 'hono/cors';

import {checkUrl, getUrlData} from './lib/util'
import { insertAndReturnId , insert } from './lib/dbutil';

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get("/", (c) => c.text("Hello World"));
app.use('/api/*', cors());

app.post('/api/visit', async (c) => {
  const retObj = {ret: "ERROR", data: null, message: "Error, Internal Server Error"};
  try{
    let visitorIP = c.req.header('CF-Connecting-IP')
    const body = await c.req.json()
    const hostname = body.hostname
    const url_path = body.url
    const referrer = body.referrer
    const page_pv = body.page_pv
    const page_uv = body.page_uv
    const site_pv = body.site_pv
    const site_uv = body.site_uv
    let referrer_path = ''
    let referrer_domain = ''
    if (referrer&&checkUrl(referrer)){
      const referrerData = getUrlData(referrer);
      referrer_domain = referrerData.hostname;
      referrer_path = referrerData.pathname;
    }
    const website  = await c.env.DB.prepare('select id, domain from t_website where domain = ?').bind(hostname).first();
    let websiteId: number;
    if (website){
      await insert(c.env.DB, 
        'insert into t_web_visitor (website_id, url_path, referrer_domain, referrer_path, visitor_ip) values(?, ?, ?, ?, ?)',
        [website.id, url_path, referrer_domain, referrer_path, visitorIP]);
      websiteId = Number(website.id);
    } else{
      websiteId = await insertAndReturnId(c.env.DB, 'insert into t_website (name, domain) values(?,?)',[hostname.split(".").join("_"), hostname]);
      await insert(c.env.DB, 
        'insert into t_web_visitor (website_id, url_path, referrer_domain, referrer_path, visitor_ip) values(?, ?, ?, ?, ?)', 
        [websiteId, url_path, referrer_domain, referrer_path, visitorIP]);
    }
    const resData:{page_pv?: number, page_uv?: number, site_pv?: number, site_uv?: number} = {}
    if (page_pv){
      const total = await c.env.DB.prepare('SELECT COUNT(*) AS total from t_web_visitor where website_id = ? and url_path = ?').bind(websiteId, url_path).first('total');
      resData['page_pv'] = Number(total)
    }
    if (page_uv){
      const total = await c.env.DB.prepare('SELECT COUNT(*) AS total from (select DISTINCT visitor_ip from t_web_visitor where website_id = ? and url_path = ?) t').bind(websiteId, url_path).first('total');
      resData['page_uv'] = Number(total)
    }
    if (site_pv){
      const total = await c.env.DB.prepare('SELECT COUNT(*) AS total from t_web_visitor where website_id = ?').bind(websiteId).first('total');
      resData['site_pv'] = Number(total)
    }
    if (site_uv){
      const total = await c.env.DB.prepare('SELECT COUNT(*) AS total from (select DISTINCT visitor_ip from t_web_visitor where website_id = ?) t').bind(websiteId).first('total');
      resData['site_uv'] = Number(total)
    }
    return c.json({ret: "OK", data: resData});
  } catch (e) {
    console.error(e);
    return c.json(retObj);
  }
})


app.onError((err, c) => {
	console.error(`${err}`);
	return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));
export default app