import sys
from manage import database_read
import numpy
from datetime import datetime
from django.shortcuts import HttpResponse
import json
# TODO: latitude and longitude sample width incorrect
'''
def database_read(time, type, min_lat, min_lng, max_lat, max_lng, lat_npoints, lng_npoints):
    query_result = numpy.random.uniform(low=0, high=100, size=(lat_npoints, lng_npoints));
    return query_result
'''
def dataServer(request):
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
