function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function theLocation(){
	var city = document.getElementById("cityName").value;
	alert(city);
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

function zoomed_callback() {   
    var pixel_radius = pixel_step(0.003, 0.003);
    heatmapOverlay.setOptions({"radius":pixel_radius});
}

function pixel_step(lng_s, lat_s)
{
    var p1 = new BMap.Point(116.4, 39.92);
    var p2 = new BMap.Point(116.4 + lng_s, 39.92 + lat_s);
    var pix1 = map.pointToPixel(p1);
    var pix2 = map.pointToPixel(p2);
    var d_lng = pix2.x - pix1.x;
    var d_lat = pix2.y - pix1.y;
    return Math.sqrt(d_lng * d_lng + d_lat * d_lat);
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
