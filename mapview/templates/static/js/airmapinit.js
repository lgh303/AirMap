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

    map.centerAndZoom(new BMap.Point(116.4, 39.92), 15);             // 初始化地图，设置中心点坐标和地图级别
    map.addEventListener("dragend", function(){    
        var center = map.getCenter();
        //alert("地图中心点变更为：" + center.lng + ", " + center.lat);    
        var bound = map.getBound();
        setDataWindow(bound.ve, bound.we, bound.qe, bound.re);
    });
    map.addEventListener("zoomend", function(){    
        var bound = map.getBound();
        setDataWindow(bound.ve, bound.we, bound.qe, bound.re);
    });
}

function init_marker() {
    // defined in marker.js
	map.addEventListener("click", function(e){
        onLeftClick(e);
    });
    setRightClickMenu();
    showMarker();
}

function init_overlay() {
    map.addOverlay(heatmapOverlay);
    map.addEventListener("zoomend", zoomed_callback);
    heatmapOverlay.setDataSet({data:[[]],max:100});
    heatmapOverlay.setOptions({"radius" : get_radius()});
    changeMapStyle('midnight')
}

function init_timeline()
{
    var hour_ms= 3600*1000;
	scale_timeline(cur_time_ms-hour_ms*100, cur_time_ms, hour_ms, cur_time_ms);
}

function init_typectrl() {
    var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
    var mapType2 = new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT});
    map.addControl(mapType1);          //2D图，卫星图
    map.addControl(mapType2);          //左上角，默认地图控件
    map.setCurrentCity("北京");        //由于有3D图，需要设置城市哦
}

function init_overview() {
    var overView = new BMap.OverviewMapControl();
    var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
    map.addControl(overView);          //添加默认缩略地图控件
    map.addControl(overViewOpen);      //右下角，打开
}

function init_dataset() {
	cur_data_type = 3;
	cur_time_ms = new Date().getTime();
	setFrame(116.3, 116.5, 39.85, 39.95);
}
