    function zoomed_callback() {   
    }

    function isSupportCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
    function pixel_step(lng_s, lat_s)
    {
        var p1 = new BMap.Point(116.4, 39.92);
        var p2 = new BMap.Point(116.4 + lng_s, 39.92 + lat_s);
        var pix1 = map.pointToPixel(p1);
        var pix2 = map.pointToPixel(p2);
        var d_lng = pix2.x - pix1.x;
        var d_lat = pix2.y - pix1.y;
        return Math.sqrt(d_lng * d_lng + d_lat * d_lat);
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
