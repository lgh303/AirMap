function change_datatype(event) {
        var evt=evt || window.event;   
        var e =evt.srcElement || evt.target;
        //alert(e.value);
        cur_data_type = e.value;
        var top = document.getElementById("top_content").innerHTML;
        var bot = document.getElementById("bot_content").innerHTML
        switch(cur_data_type){
            case "AQI":
                top = "严重污染";
                bot = "轻度污染";
                break;
            case "temperature":
                top = "高温";
                bot = "低温";
                break;
            case "wind":
                top = "大风";
                bot = "小风";
                break;
            case "humid":
                top = "潮湿";
                bot = "干旱";
                break;
            case "rain":
                top = "小雨";
                bot = "大雨";
                break;
        }
        document.getElementById("top_content").innerHTML = top;
        document.getElementById("bot_content").innerHTML = bot;
    }