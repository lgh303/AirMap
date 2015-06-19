function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function theLocation(){
	var city = document.getElementById("cityName").value;
	//alert(city);
	if(city != ""){
		map.centerAndZoom(city,11);      // 用城市名设置地图中心点
		var myGeo = new BMap.Geocoder();
		myGeo.getPoint(city, function(point){
			var marker = new BMap.Marker(point);  // 创建标注
			map.addOverlay(marker);               // 将标注添加到地图中
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
		});
	}
}

function get_radius() {
    return 80;
}

function zoomed_callback() {   
    heatmapOverlay.setOptions({"radius" : get_radius()});
}

function changeMapStyle(style){
	map.setMapStyle({style:style});
	$('#desc').html(mapstyles[style].desc);
}

function setGradient(){
    var gradient = {};
    var colors = document.querySelectorAll("input[type='color']");
    colors = [].slice.call(colors,0);
    colors.forEach(function(ele){
        gradient[ele.getAttribute("data-key")] = ele.value; 
    });
    heatmapOverlay.setOptions({"gradient":gradient});
}

function openHeatmap(){
    heatmapOverlay.show();
}

function closeHeatmap(){
    heatmapOverlay.hide();
}
