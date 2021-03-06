function drawWeather(){
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
            var chartContainer = document.getElementById("weather");
            var myChart = ec.init(chartContainer);
            myChart.setOption({
                title: {
                    text: "", 
                    x: "center"
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['天气状况'] //与series保持一致
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
                        data: function(){
                            var today = new Date();
                            var data_length = points.length;
                            var list = [];
                            for(var i=0; i<data_length; i++){
                                var d = new Date(today - 24*60*60*1000*i);
                                list.push(d.getDate());
                            }
                            return list;
                        }()
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '天气状况',
                        type: 'bar',
                        data: function(){
                            var data_length = points.length;
                            var list = [];
                            for(var i=0; i<data_length; i++){
                                list.push(points[i][globalIterator].count);
                            }
                            return list;
                        }(),
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
function drawPollution(){
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
            var chartContainer = document.getElementById("pollution");
            var myChart = ec.init(chartContainer);
            myChart.setOption({
                title: {
                    text: "", 
                    x: "center"
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['污染程度'], //与series保持一致
                    y:"bottom"
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
                        data: function(){
                            var today = new Date();
                            var data_length = points.length;
                            var list = [];
                            for(var i=0; i<data_length; i++){
                                var d = new Date(today - 24*60*60*1000*i);
                                list.push(d.getDate());
                            }
                            return list;
                        }()
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
                        name: '污染程度',
                        type: 'line',
                        data: function(){
                            var data_length = points.length;
                            var list = [];
                            for(var i=0; i<data_length; i++){
                                list.push(points[i][globalIterator].count);
                            }
                            return list;
                        }(),
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

// temperature
function drawTemperature(){
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
            var chartContainer = document.getElementById("temperature");
            var myChart = ec.init(chartContainer);
            myChart.setOption({
                title: {
                    text: "", 
                    x: "center",
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['气温信息'], //与series保持一致
                    y:"bottom"
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
                        data: function(){
                            var today = new Date();
                            var data_length = points.length;
                            var list = [];
                            for(var i=0; i<data_length; i++){
                                var d = new Date(today - 24*60*60*1000*i);
                                list.push(d.getDate());
                            }
                            return list;
                        }()
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
                        name:'气温信息',
                        type:'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},      
                        data: function(){
                            var data_length = points.length;
                            var list = [];
                            for(var i=0; i<data_length; i++){
                                list.push(points[i][globalIterator].count);
                            }
                            return list;
                        }()
                    }
                ]
            });
        }
    );
}

//</script>

//<script type="text/javascript" language="javascript">
function weather(){
    var sContent =
        "<div id=\"weather\" style=\"height: 400px; width:800px; border:1px solid #ccc; padding: 10px;\"></div>";
    var infoWindow = new BMap.InfoWindow(sContent);
    var drawPoint = new BMap.Point(globalPoint.lng + 0.001, globalPoint.lat + 0.001);
    map.openInfoWindow(infoWindow, drawPoint);
    drawWeather();
}

function pollution(){
    var sContent =
        "<div id=\"pollution\" style=\"height: 400px; width:800px; border:1px solid #ccc; padding: 10px;\"></div>";
    var infoWindow = new BMap.InfoWindow(sContent);
    var drawPoint = new BMap.Point(globalPoint.lng + 0.002, globalPoint.lat + 0.002);
    map.openInfoWindow(infoWindow, drawPoint);
    drawPollution();
}

function temperature(){
    var sContent =
        "<div id=\"temperature\" style=\"height: 400px; width:800px; border:1px solid #ccc; padding: 10px;\"></div>";
    var infoWindow = new BMap.InfoWindow(sContent);
    var drawPoint = new BMap.Point(globalPoint.lng + 0.003, globalPoint.lat + 0.003);
    map.openInfoWindow(infoWindow, drawPoint);
    drawTemperature();
}
//</script>

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
//</script>

//<script>
function setRightClickMenu(){
    var menu = new BMap.ContextMenu();
    var txtMenuItem = [
        {
            text:'放大',
            callback:function(){map.zoomIn()}
        },
        {
            text:'缩小',
            callback:function(){map.zoomOut()}
        },
        {
            text:"其他",
            callback:function(){alert("no function availiable")}
        }
    ];
    for(var i=0; i < txtMenuItem.length; i++){
        menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
    }
    map.addContextMenu(menu);
}
//</script>

//<script>
function onLeftClick(event){
    current_x = event.point.lng;
    current_y = event.point.lat;
    var opts = {
        width : 150, // 信息窗口宽度
        height: 80, // 信息窗口高度
        title : "Weather Here" // 信息窗口标题
    }
    //弹出一个提示窗口
    var infoWindow = new BMap.InfoWindow("Current position:("+current_x+":"+current_y+")", opts);
    map.openInfoWindow(infoWindow, new BMap.Point(current_x,current_y));        // 打开信息窗口
}
//</script>

//<script>
function showMarker(){

    var sContent =
        "<div id=\"main\" style=\"height: 200px; width:400px; border:1px solid #ccc; padding: 10px;\">"
        + "<h1> 气象站点信息 </h1>"
        + "<form name = \"form1\" >"
        + "<p><input type = \"BUTTON\" value = \" 天气 \" onClick = \"weather()\"></p>"
        + "<p><input type = \"BUTTON\" value = \" 污染 \" onClick = \"pollution()\"></p>"
        + "<p><input type = \"BUTTON\" value = \" 温度 \" onClick = \"temperature()\"></p>"
        + "</form>"
        + "</div>";
    var infoWindow = new BMap.InfoWindow(sContent);

    for(var i=0; i<points[0].length; i++){
        var p = new BMap.Point(points[0][i].lng, points[0][i].lat);
        var station = new BMap.Marker(p);
        station.addEventListener("rightclick", function(e){          
            this.openInfoWindow(infoWindow);
            getStation(e);
            //drawStation();
            //document.getElementById('imgDemo').onload = function (){
            //    infoWindow.redraw();
            //}
        });
        map.addOverlay(station);
    }
}
