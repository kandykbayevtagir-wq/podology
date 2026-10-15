import fs from 'node:fs';
const id=process.env.D1_DATABASE_ID;if(!/^[0-9a-f-]{36}$/i.test(id||''))throw Error('Set D1_DATABASE_ID repository variable');const path=new URL('../wrangler.jsonc',import.meta.url),data=JSON.parse(fs.readFileSync(path));data.d1_databases[0].database_id=id;fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
