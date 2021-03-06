var cur_lat_min, cur_lat_max, cur_lng_min, cur_lng_max, cur_data_type, cur_time_ms, cur_gradient;
var lat_npoints=30, lng_npoints=40;  //----

var stamp_sended=0, stamp_recved=0, stamp_ploted=0;

var aqi_gradient = { 0 : 'rgb(0,0,255)', 0.4: 'rgb(0, 255, 255)', 0.8 : 'rgb(255,255,0)', 1 : 'rgb(255,0,0)'};
var temper_gradient = { 0 : 'rgb(255,0,255)', 0.5 : 'rgb(0,255,0)', 1 : 'rgb(0,0,0)'};
var wind_gradient = { 0 : 'rgb(0,0,255)', 0.5 : 'rgb(0,255,0)', 1 : 'rgb(255,0,0)'};
var humid_gradient = { 0 : 'rgb(250,0,0)', 0.8 : 'rgb(0,255,255)', 1 : 'rgb(0,0,255)'};
var rain_gradient = { 0 : 'rgb(0,0,0)', 0.5 : 'rgb(0,255,0)', 1 : 'rgb(255, 0, 0)'};

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

            var value_offset = 0, value_range = 500, value_factor = 1;;
            switch(cur_data_type)
            {
            case "AQI":
                break;
            case "temperature":
                value_offset = -10;
                value_range = 30;
                break;
            case "wind":
                value_offset = 0;
                value_range = 10;
                break;
            case "humid":
                value_offset = 0;
                value_range = 100;
                break;
            case "rain":
                value_factor = 100;
                value_offset = 0;
                value_range = 100;
                break;
            }
			for (var i=0, lat=lat_min; i<lat_npoints; ++i, lat+=lat_step)
				for (var j=0, lng=lng_min; j<lng_npoints; ++j, lng+=lng_step)
				{
					var value = values[i*lng_npoints+j] * value_factor + value_offset;
					if (value < 0)
						value = 0.0001;
					framePoints.push({"lng":lng,"lat":lat,"count":value});
				}

			callback(framePoints, value_range);
			
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

function pullDataCallback(framePoints, value_range)
{
	heatmapOverlay.setDataSet({data:framePoints,max:value_range});
	heatmapOverlay.setOptions({"radius" : get_radius()});             //-----
	heatmapOverlay.setOptions({"gradient" : cur_gradient});             //-----
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


// for markers
function setDataOnePoint(lng, lat){
    pullDataOnePoint(lng, lat, cur_data_type, pullDataOnePointCallback);
}

function pullDataOnePoint(lng, lat, data_type, callback){
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

            points = []
            for (var i=0; i<values.length; i=i+1)
                points.push(values[i])
            /*
            var framePoints= new Array();
            for (var i=0, lat=lat_min; i<lat_npoints; ++i, lat+=lat_step)
                for (var j=0, lng=lng_min; j<lng_npoints; ++j, lng+=lng_step)
                    framePoints.push({"lng":lng,"lat":lat,"count":values[i*lng_npoints+j] * value_factor + value_offset});
            */
            callback();
            
            stamp_ploted= new Date().getTime();
            }
    }
    xmlhttp.open(
        "GET",
        "dataServer?request_type=getOnePoint&lng="+lng+"&lat="+lat+"&data_type="+data_type+"&ts="+minTime_ms+"&te="+cur_time_ms,
        true
        );
    xmlhttp.send();
    stamp_sended = new Date().getTime();
}

function pullDataOnePointCallback(){
    echartDrawFunc();
    /*
    var bound = map.getBounds();
    var moved = ( (bound.ve != cur_lat_min) || (bound.qe != cur_lat_max) || (bound.we != cur_lng_min) || (bound.re != cur_lng_max) );
    if(moved){
        setFrame(bound.we, bound.re, bound.ve, bound.qe);
    }
    */
}

var points =[]
