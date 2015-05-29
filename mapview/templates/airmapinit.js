function init_mapstylelist(sel) {
    for(var key in mapstyles){
	    var style = mapstyles[key];
	    var item = new  Option(style.title,key);
	    sel.options.add(item);
    }
	sel.value = 'midnight';
}

function init_airmap() {
	map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
	map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
	map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
	map.addControl(new BMap.MapTypeControl());          //添加地图类型控件

    map.enableScrollWheelZoom(); // 允许滚轮缩放
	map.disable3DBuilding();

    var center_point = new BMap.Point(116.4, 39.92);
    map.centerAndZoom(center_point, 15);             // 初始化地图，设置中心点坐标和地图级别
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
