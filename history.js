var history = [
	{
	id: 1,
	name: "Start",
	ts: Date.now()
},
];
var history_size=1000;
module.exports.all = history;

module.exports.recent = function(){
  if(history.length >= history_size){
		history=history.slice(-(history_size-1));
	}
	//return history.slice(-100);
	return history;
}

module.exports.new = function(){
	return{
		name: '',
		ts:Date.now() 
	};
}

module.exports.insert = function(message){
	var new_id = history.length + 1;
	history.push({id:new_id, ts:Date.now(),name:message});
	console.log("inserted:" + history[history.length-1].id+":"+history[history.length-1].ts+":"+history[history.length-1].name);
	return new_id;
}

