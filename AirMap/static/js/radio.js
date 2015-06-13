function change_datatype(event) {
    var evt=evt || window.event;   
    var e =evt.srcElement || evt.target;
    //alert(e.value);
    var type_changed = (cur_data_type != e.value);
    cur_data_type = e.value;
    var top = document.getElementById("top_content").innerHTML;
    var bot = document.getElementById("bot_content").innerHTML
    switch(cur_data_type){
        case "AQI":
            bot = "严重污染";
            top = "轻度污染";
            cur_gradient = aqi_gradient;
            break;
        case "temperature":
            bot = "高温";
            top = "低温";
            cur_gradient = temper_gradient;
            break;
        case "wind":
            bot = "大风";
            top = "小风";
            cur_gradient = wind_gradient;
            break;
        case "humid":
            bot = "潮湿";
            top = "干旱";
            cur_gradient = humid_gradient;
            break;
        case "rain":
            bot = "大雨";
            top = "小雨";
            cur_gradient = rain_gradient;
            break;
    }
    document.getElementById("top_content").innerHTML = top;
    document.getElementById("bot_content").innerHTML = bot;
    if (type_changed)
    {
        radio_draw();
        refresh();
    }
}

function radio_draw() {
    var canvas = document.getElementById('lineGradient');
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    var grad  = ctx.createLinearGradient(0,0, 0,140);
    for(var key in cur_gradient){
        grad.addColorStop(key,cur_gradient[key]);
    }
    ctx.fillStyle = grad;
    ctx.rect(0,0, 40, 210);
    ctx.fill();
}
