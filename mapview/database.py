import sys
from manage import database_read
from manage import database_bound
import numpy
from datetime import datetime
import time;
from django.shortcuts import HttpResponse
import json
# TODO: latitude and longitude sample width incorrect

# def database_read(time, type, min_lat, min_lng, max_lat, max_lng, lat_npoints, lng_npoints):
#     query_result = numpy.random.uniform(low=0, high=100, size=(lat_npoints, lng_npoints));
#     return query_result

# def database_bound(_types=[]):
#     return datetime(2015, 5, 11, 11, 0, 0), datetime(2015, 5, 21, 11, 0, 0);

def getTimeBound(request):
    minTime, maxTime = database_bound();
    minTime_ms = time.mktime(minTime.timetuple()) * 1000;
    maxTime_ms = time.mktime(maxTime.timetuple()) * 1000;

    return  HttpResponse(json.dumps({
        'minTime_ms' : minTime_ms,
        'maxTime_ms' : maxTime_ms
    }), content_type = 'application/json')


def getPoints(request):
    lat_min = float(request.GET.get('lat_min'));
    lat_max = float(request.GET.get('lat_max'));
    lng_min = float(request.GET.get('lng_min'));
    lng_max = float(request.GET.get('lng_max'));
    lat_npoints = int(request.GET.get('lat_npoints'));
    lng_npoints = int(request.GET.get('lng_npoints'));
    data_type = request.GET.get('data_type');
    time_ms = long(request.GET.get('time_ms'));

    time_s = time_ms * 1.0 / 1000;

    time = datetime.fromtimestamp(time_s)

    print("This is " + str(time), data_type)
    sys.stdout.flush()
    try:

        query_result = database_read(time, data_type, lat_min, lng_min, lat_max,
                                     lng_max, lat_npoints, lng_npoints);
    except Exception, e:
        print(e)
        print("Exception!")
        raise
    # plt.imshow(query_result)

    print(lat_npoints, lng_npoints)
    values = []
    for i in range(0, lat_npoints):
        for j in range(0, lng_npoints):
            values.append(query_result[i][j]);

    return  HttpResponse(json.dumps({
        'values' : values
    }), content_type = 'application/json')

def dataServer(request):
    request_type = request.GET.get('request_type');

    if request_type == 'getPoints':
        return getPoints(request);
    elif request_type == 'getTimeBound':
        return getTimeBound(request);

