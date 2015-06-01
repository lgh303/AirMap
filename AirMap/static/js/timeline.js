var dates_ms;  //date数组，各pip对应时间点
var selected_ms; //当前pip对应时间点
var pips;   //pip总点数

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
		if (i%5==0)
		{
			var date= new Date();
			date.setTime(dates_ms[i]);
			
			labels[i]= date.toTimeString().substring(0,5);
		}
		else
			labels[i]="";
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
	    delta = event.wheelDelta/120; 
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
