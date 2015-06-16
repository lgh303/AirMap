function getEchartName(){
    switch(cur_data_type){
    case "AQI":
        return "AQI";
    case "temperature":
        return "温度";
    case "wind":
        return "风力";
    case "humid":
        return "湿度";
    case "rain":
        return "降雨";
    }
}

function getDateList(){
    var max_length = points.length;
    if(points.length > 18){
        max_length = 18;
    }
    var today = new Date(cur_time_ms);
    var list = [];
    list.push(today.getMonth() + "月" + today.getDate() + "日");
    for(var i=1; i < max_length; i++){
        d = new Date(today - 60*60*1000*i);
        list.push(d.getHours() + "H");
    }
    return list.reverse();
}

function getValueList(){
    var max_length = points.length;
    if(points.length > 18){
        max_length = 18;
    }
    var list = [];
    for(var i=0; i < max_length; i++){
        list.push(points[i]);
    }
    return list.reverse();   
}

function drawInBar(){
    require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            var chartContainer = document.getElementById("echartDrawBoard");
            var myChart = ec.init(chartContainer);
            var echartName = getEchartName();
            myChart.setOption({
                title: {
                    text: "", 
                    x: "center"
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [echartName] //与series保持一致
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: false,
                        dataView: { readOnly: false },
                        magicType: ['line', 'bar'],
                        restore: true,
                        saveAsImage: true
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        name: "日期",
                        data: getDateList()
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: echartName,
                        type: 'bar',
                        data: getValueList(),
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            });
        }
    );
}

// pollution
function drawInLine(){
    require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/line'
        ],
        function (ec) {
            var chartContainer = document.getElementById("echartDrawBoard");
            var myChart = ec.init(chartContainer);
            var echartName = getEchartName();
            myChart.setOption({
                title: {
                    text: "", 
                    x: "center"
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [echartName] //与series保持一致
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: false,
                        dataView: { readOnly: false },
                        magicType: ['line', 'bar'],
                        restore: true,
                        saveAsImage: true
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        name: "日期",
                        data: getDateList()
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitArea: { show: true },
                        name:"数值"
                    }
                ],
                series: [
                    {
                        name: echartName,
                        type: 'line',
                        data: getValueList(),
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }                        
                    }
                ]
            });
        }
    );
}

function drawInShape(){
    require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/line'
        ],
        function (ec) {
            var chartContainer = document.getElementById("echartDrawBoard");
            var myChart = ec.init(chartContainer);
            var echartName = getEchartName();
            myChart.setOption({
                title: {
                    text: "", 
                    x: "center",
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [echartName] //与series保持一致
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: false,
                        dataView: { readOnly: false },
                        magicType: ['line', 'bar'],
                        restore: true,
                        saveAsImage: true
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        name: "日期",
                        data: getDateList()
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitArea: { show: true },
                        name:"数值"
                    }
                ],
                series: [
                    {
                        name: echartName,
                        type:'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},      
                        data: getValueList()
                    }
                ]
            });
        }
    );
}

function echartDrawFunc(){
    var sContent =
        "<div id=\"echartDrawBoard\" style=\"height: 400px; width:800px; border:1px solid #ccc; padding: 10px;\"></div>";
    var infoWindow = new BMap.InfoWindow(sContent);
    var drawPoint = new BMap.Point(globalPoint.lng + 0.001, globalPoint.lat + 0.001);
    map.openInfoWindow(infoWindow, drawPoint);
    
    switch(cur_data_type){
        case "AQI":
            drawInBar();
            break;
        case "temperature":
            drawInLine();
            break;
        case "wind":
            drawInShape();
            break;
        case "humid":
            drawInBar();
            break;
        case "rain":
            drawInLine();
            break;
    }
}

//<script type="text/javascript" language"javascript">
// global variable for station information
// change this when click on the map
var globalPoint = new BMap.Point(116.4, 39.92);
var globalIterator = 0;

function getStation(event){
    // get the nearest station to this click event
    current_lng = event.point.lng;
    current_lat = event.point.lat;
    
    var which = -1;
    var dist = 1000000;
    for(var i=0; i<points[0].length; i++){
        var temp = Math.abs(current_lng - points[0][i].lng) + Math.abs(current_lat - points[0][i].lat);
        if(temp < dist){
            dist = temp;
            which = i;
        }
    }
    if(which == -1){
        which = 0;
        alert("can not find station");
    }
    globalPoint.lng = points[0][which].lng;
    globalPoint.lat = points[0][which].lat;
    globalIterator = which;
}

function onLeftClick(event){
    /*
    current_x = event.point.lng;
    current_y = event.point.lat;
    var opts = {
        width : 150,
        height: 80,
        title : "Weather Here"
    }    
    var infoWindow = new BMap.InfoWindow("Current position:("+current_x+":"+current_y+")", opts);
    map.openInfoWindow(infoWindow, new BMap.Point(current_x,current_y));        // 打开信息窗口
    */
}

function onRightClick(event){
    current_lng = event.point.lng;
    current_lat = event.point.lat;
    globalPoint = event.point;
    setDataOnePoint(current_lng, current_lat);
}
