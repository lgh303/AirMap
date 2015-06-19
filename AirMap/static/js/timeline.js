var dates_ms;  //date数组，各pip对应时间点
var selected_ms; //当前pip对应时间点
var pips;   //pip总点数

var hour_ms= 3600*1000;
var day_ms= hour_ms*24;

var maxTime_ms;
var minTime_ms;

function setTimeBound()
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
			minTime_ms = responseObj.minTime_ms;
			maxTime_ms = responseObj.maxTime_ms;
		}
	}
	
	xmlhttp.open(
		"GET",
		"dataServer?request_type=getTimeBound",
		true
		);
	xmlhttp.send();
}

function mycallback(value)
{
	selected_ms = dates_ms[value];
	setTime(selected_ms);
}

function show_timeline(labels, selectedIndex)
{	
	$(".slider").slider({
		min: 0,
		max: pips-1,
		step: 1,
		value: selectedIndex
	})
		.slider("pips", {
		    callback: mycallback,
		    labels: labels,
		    rest: "label"
		});
}

function scale_timeline(startTime_ms, endTime_ms, step_ms, selectTime_ms)
{
	//alert('scale_timeline\n'+'start: '+startTime_ms+'\nmin: '+minTime_ms+'\nstart<min: '+(startTime_ms<minTime_ms)+'\nend: '+endTime_ms+'\nmax: '+
		//maxTime_ms+'\nend>max:'+(endTime_ms>maxTime_ms)+'\n\nend: '+new Date(endTime_ms)+'\nmax: '+new Date(maxTime_ms));
	if (startTime_ms < minTime_ms)
	{
		//alert('out of lower bound, reset to: \n' + new Date(minTime_ms) + '\origin: \n'+ new Date(startTime_ms));
		startTime_ms = minTime_ms;
	}
	
	if (endTime_ms > maxTime_ms)
	{
		//alert('out of upper bound, reset to: \n' + new Date(maxTime_ms) + '\norigin: \n'+ new Date(endTime_ms));
		endTime_ms = maxTime_ms;
	}
	
	pips=0;
	dates_ms= new Array();  
	
	while (startTime_ms < endTime_ms)
	{
		dates_ms[pips]= startTime_ms;
		
		pips++;
		startTime_ms += step_ms;
	}
	
	
	var selectedIndex= -1;
	for (var i=0; i<pips; ++i)
		if (dates_ms[i] >= selectTime_ms)
	{
		selectedIndex = i;
		break ;
	}
	
	if (selectedIndex == -1)
		selectedIndex = pips-1;
	
	
	var labels= new Array();
	var labelstep= 5;             //
	for (var i=0; i<pips; i++)
	{
		if (dates_ms[i]%day_ms == 0)
			labels[i]= new Date(dates_ms[i]).toString().substring(4,10);
		else
		{
			if (i%5==0)
			{
				var date= new Date();
				date.setTime(dates_ms[i]);
				
				labels[i]= date.toTimeString().substring(0,5);
			}
			else
				labels[i]="";
		}
		
	}
	
	show_timeline(labels, selectedIndex);
}	

function handle_timeline(delta) 
{
	scale_timeline(dates_ms[0]-delta*hour_ms, dates_ms[pips-1]+delta*hour_ms, hour_ms, selected_ms)
}

function showKey()
{
	var delta = 0;
	if (event.wheelDelta) 
	{
	    delta = event.wheelDelta/120*10; 
	    if (window.opera) 
	        delta = -delta;
	} 
	else if (event.detail) 
	{
	    delta = -event.detail/3;
	}
	
	if (delta)
	    handle_timeline(delta);
}

function shiftTimeInterval(delta)
{
	scale_timeline(dates_ms[0]+delta*hour_ms, dates_ms[pips-1]+delta*hour_ms, hour_ms, selected_ms)
}

function shiftTimeIntervalLeft()
{
	shiftTimeInterval(-2);
}

function shiftTimeIntervalRight()
{
	shiftTimeInterval(2);
}

