function init_mapstylelist(sel) {
    for(var key in mapstyles){
	    var style = mapstyles[key];
	    var item = new  Option(style.title,key);
	    sel.options.add(item);
    }
	sel.value = 'midnight';
}

function init_map() {

}

function init_timeline() {

}

function init_littlemap() {

}

function airmap_init() {
    init_map();
    init_timeline();
    init_littlemap();
}
