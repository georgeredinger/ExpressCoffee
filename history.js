var dat = [
	{
	id: 1,
	name: "Start",
	ts: Date.now()
},
];
var history_size=1000;

module.exports.recent = function(){
  if(dat.length >= history_size){
		dat=dat.slice(-(history_size-1));
	}
	//return history.slice(-100);
	return dat;
}

module.exports.new = function(){
	return{
		name: '',
		ts:Date.now() 
	};
}

module.exports.insert = function(message){
	var new_id = dat.length + 1;
	dat.push({id:new_id, ts:Date.now(),name:message});
	console.log("inserted:" + dat[dat.length-1].id+":"+dat[dat.length-1].ts+":"+dat[dat.length-1].name);
	return new_id;
}

