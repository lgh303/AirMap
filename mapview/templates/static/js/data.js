var cur_lat_min, cur_lat_max, cur_lng_min, cur_lng_max, cur_data_type, cur_time_ms;
var lat_npoints=40, lng_npoints=30;  //----

function pullData(lat_min, lat_max, lng_min, lng_max, data_type, time_ms, callback)
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{
		xmlhttp = new XMLHttpRequest();
	}
	else
	{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
		
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var responseObj = JSON.parse(xmlhttp.responseText);
			var values= responseObj.values;
			
			var framePoints= new Array();
			var lat_step= (lat_max-lat_min)/lat_npoints,  lng_step= (lng_max-lng_min)/lng_npoints;
			for (var i=0, lat=lat_min; i<lat_npoints; ++i, lat+=lat_step)
				for (var j=0, lng=lng_min; j<lng_npoints; ++j, lng+=lng_step)
					framePoints.push({"lng":lng,"lat":lat,"count":values[i*lng_npoints+j]});
			
			callback(framePoints);
		}
	}
	
	xmlhttp.open(
		"GET",
		"dataServer?lat_min="+lat_min+"&lat_max="+lat_max+"&lng_min="+lng_min+"&lng_max="+lng_max+"&lat_npoints="+lat_npoints+"&lng_npoints="+lng_npoints+"&data_type="+data_type+"&time_ms="+time_ms,
		true
		);
	xmlhttp.send();
}

function pullDataCallback(framePoints)
{
	var frames= [framePoints];
	heatmapOverlay.setDataSet({data:frames[0],max:100});
	heatmapOverlay.setOptions({"radius" : 30});             //-----
}

function refresh()
{
	pullData(cur_lat_min, cur_lat_max, cur_lng_min, cur_lng_max, cur_data_type, cur_time_ms, pullDataCallback);
}

function setFrame(lng_min, lng_max, lat_min, lat_max)
{
	cur_lat_min= lat_min;
	cur_lat_max= lat_max;
	cur_lng_min= lng_min;
	cur_lng_max= lng_max;
	
	refresh();
}

function setTime(time_ms)
{
	cur_time_ms= time_ms;
	refresh();
}


var points =[
[{"lng":116.421004,"lat":39.961727,"count":14}
]]