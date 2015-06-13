var cur_lat_min, cur_lat_max, cur_lng_min, cur_lng_max, cur_data_type, cur_time_ms;
var lat_npoints=30, lng_npoints=40;  //----

var stamp_sended=0, stamp_recved=0, stamp_ploted=0;

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
			stamp_recved= new Date().getTime();
			var responseText = xmlhttp.responseText.replace(/NaN/g, "0.03");
			var responseObj = JSON.parse(responseText);
            console.log(responseText);
			var values= responseObj.values;

			var framePoints= new Array();
			var lat_step= (lat_max-lat_min)/lat_npoints,  lng_step= (lng_max-lng_min)/lng_npoints;
			for (var i=0, lat=lat_min; i<lat_npoints; ++i, lat+=lat_step)
				for (var j=0, lng=lng_min; j<lng_npoints; ++j, lng+=lng_step)
					framePoints.push({"lng":lng,"lat":lat,"count":values[i*lng_npoints+j] - 13});

			callback(framePoints);
			
			stamp_ploted= new Date().getTime();
			
			//alert(	"from sended to recved, cost: "+ (stamp_recved-stamp_sended)+" ms\n"+
				//	"from recved to ploted, cost: "+ (stamp_ploted-stamp_recved)+" ms\n");
		}
	}
	
	xmlhttp.open(
		"GET",
		"dataServer?request_type=getPoints&lat_min="+lat_min+"&lat_max="+lat_max+"&lng_min="+lng_min+"&lng_max="+lng_max+"&lat_npoints="+lat_npoints+"&lng_npoints="+lng_npoints+"&data_type="+data_type+"&time_ms="+time_ms,
		true
		);
	xmlhttp.send();
	stamp_sended = new Date().getTime();
}

function pullDataCallback(framePoints)
{
	heatmapOverlay.setDataSet({data:framePoints,max:30});
	heatmapOverlay.setOptions({"radius" : get_radius()});             //-----
}

function refresh()
{
	pullData(cur_lat_min, cur_lat_max, cur_lng_min, cur_lng_max, cur_data_type, cur_time_ms, pullDataCallback);
}

function setFrame(lng_min, lng_max, lat_min, lat_max)
{
    // var margin_percent = 0.1;
    // var lat_diff = (lat_max - lat_min) * margin_percent;
    // var lng_diff = (lng_max - lng_min) * margin_percent;
	// cur_lat_min= lat_min - lat_diff;
	// cur_lat_max= lat_max + lat_diff;
	// cur_lng_min= lng_min - lng_diff;
	// cur_lng_max= lng_max + lng_diff;
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
