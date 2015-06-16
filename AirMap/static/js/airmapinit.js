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

    // map.centerAndZoom(new BMap.Point(116.4, 39.92), 15);             // 初始化地图，设置中心点坐标和地图级别
    map.centerAndZoom(new BMap.Point(106.4, 30.92), 7);             // 初始化地图，设置中心点坐标和地图级别
    map.addEventListener("dragend", function(){    
        var center = map.getCenter();
        //alert("地图中心点变更为：" + center.lng + ", " + center.lat);    
        var bound = map.getBounds();
        setFrame(bound.we, bound.re, bound.ve, bound.qe);
    });
    map.addEventListener("zoomend", function(){    
        var bound = map.getBounds();
        setFrame(bound.we, bound.re, bound.ve, bound.qe);
    });
}

function init_marker() {
    // defined in marker.js
    map.addEventListener("click", function(e){
        onLeftClick(e);
    });
    map.addEventListener("rightclick", function(e) {
        onRightClick(e);
    });
}

function init_overlay() {
    map.addOverlay(heatmapOverlay);
    map.addEventListener("zoomend", zoomed_callback);
    changeMapStyle('midnight')
}

function init_timeline()
{
    scale_timeline(cur_time_ms-hour_ms*24, cur_time_ms, hour_ms, cur_time_ms);
}

function init_typectrl() {
    var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_HYBRID_MAP]});
    map.addControl(mapType1);
}

function init_overview() {
    var overView = new BMap.OverviewMapControl();
    var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
    map.addControl(overView);          //添加默认缩略地图控件
    map.addControl(overViewOpen);      //右下角，打开
}

function init_dataset() {
    cur_data_type = 'AQI';
    cur_time_ms = new Date("May 12, 2015, 20:00:00").getTime();
    setTimeBound();
    var bound = map.getBounds();
    setFrame(bound.we, bound.re, bound.ve, bound.qe);
}

function init_radio_draw() {
    cur_gradient = aqi_gradient;
    radio_draw();
}
