if(!isSupportCanvas()) {
	alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
}

var map = new BMap.Map("container",{minZoom:5, maxZoom:15});
var point = new BMap.Point(116.42, 39.91);
map.centerAndZoom(point, 13);
map.enableScrollWheelZoom();

heatmapOverlay = new BMapLib.HeatmapOverlay({"radius" : getRadius()});
map.addOverlay(heatmapOverlay);
heatmapOverlay.setDataSet({data:points[0],max:100});

map.addEventListener("zoomend", function() {
	heatmapOverlay.setOptions({"radius" : getRadius()});
});

openHeatmap();

function getRadius()
{
	return pixelDistance(0.012, 0.012);
}

function pixelDistance(lng_s, lat_s)
{
    var p1 = new BMap.Point(116, 39);
    var p2 = new BMap.Point(116 + lng_s, 39 + lat_s);
	var pix1 = map.pointToPixel(p1);
	var pix2 = map.pointToPixel(p2);
	var d_lng = pix2.x - pix1.x;
	var d_lat = pix2.y - pix1.y;
	return Math.sqrt(d_lng * d_lng + d_lat * d_lat);
}

function openHeatmap(){
    heatmapOverlay.show();
}
function closeHeatmap(){
    heatmapOverlay.hide();
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

function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
