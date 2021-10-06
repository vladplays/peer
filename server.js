var app = require('express')()
  , server = require('http').createServer(app)
  ,fs=require('fs')
  ,{v4:uuuidv4}=require('uuid')
let base=JSON.parse(fs.readFileSync('base.json', 'utf-8'));
function getByName(name){
	let value;
	base.forEach((v, k)=>{
		if(v.name==name)
			value=v;
	})
	return value
}
function setByName(name, name1,val){
	base.forEach((v, k)=>{
		if(v.name==name){
			base[k][name1]=val
		}
	})
}
function setByURL(url, name,val){
	base.forEach((v, k)=>{
		if(v.url==url){
			base[k][name]=val
		}
	})
}
function getByURL(url){
	let value;
	base.forEach((v, k)=>{
		if(v.url==url)
			value=v;
	})
	return value
}
app.get('/', function (req, res) {// При обращении к корневой странице
  res.sendfile(__dirname + '/login.html'); // отдадим HTML-файл
});

app.get('/login/:name', function (req, res) {
  let name=req.params.name;
  let obj=getByName(name);
  if(!obj){
	  base.push({
		  name:name,
		  url:'/'+uuuidv4(),
		  id:''
	  })
  }
  fs.createWriteStream('base.json').write(JSON.stringify(base, null, 4))
  res.writeHead(200, {'Content-Type':'text/plain'})
  res.write(getByName(name).url); 
  res.end()
});
app.get('/set(:url)', function (req, res) {
	  let url=req.params.url.replace('(', '').replace(')', '');
	 /* let id=req.params.id;
	  let val=req.params.val;
	  console.log(url/*, id, val*///)
	  //console.log(val/*, id, val*/)*/
	  let object=getByURL('/'+url.split(',')[0])
	  setByURL(object.url, url.split(',')[1], url.split(',')[2])
	  fs.createWriteStream('base.json').write(JSON.stringify(base, null, 4))
	  res.end();
	  //console.log(url.split(',')[0])
});
app.get('/getName(:room)', function (req, res) {
  let room=req.params.room.replace('(', '').replace(')', '').split(',');
  console.log('Дед: '+getByName(room[0])[room[1]])
  res.end(getByName(room[0])[room[1]])
});
app.get('/:room', function (req, res) {
  let room=req.params.room;
  res.sendfile(__dirname + '/test.html'); 
});

app.listen(8080)