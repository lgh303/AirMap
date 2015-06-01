# This file defines all functions offered by the front-end database
import datetime
import numpy
import json
from django.http import HttpResponse

############ ALL: this part is necessary for both read and write operations ##################

# These constants define the bounds on the data the database may offer
const_min_latitude = 18.26
const_max_latitude = 52.95
const_min_longitude = 74.92
const_max_longitude = 134.3

# Types of data that can be written into or read from the database
const_data_type = {'PM2.5': 0,
                   'AQI': 1,
                   'temperature': 2,
                   'wind_north_component': 3,
                   'wind_east_component': 4,
                   'humid': 5,
                   'rain': 6}

# The minimum time interval in minutes, this is guaranteed to divide 60(1h), all 'time' parameters in queries must
# be a integer multiple of this (i.e. 2015.5.2, 12:40 is valid if const_time_interval = 20, 2015.5.2, 12:41 is not)
const_time_interval = 20

############ WRITE: this part is only necessary for write operations ########################

# The resolution of the data slice that will be written into the database
const_latitude_npoints = 1000
const_longitude_npoints = 1000

# The earliest time of all data in the database, the first call to write must be this time
const_start_time = datetime.datetime(year=2015, month=5, day=12, hour=0, minute=0)

# Write a time slice of data into the database
# Parameters:
#   time:
#       type: datetime.datetime
#       the time slice we want to write, this must be continuous with the same type of data we have already written
#   type:
#       type: string, indexed by const_data_type
#       the type of data we want to write
#   data:
#       type: numpy.ndarray, must be 2-dimensional float
#       data[i][j] is the value at latitude corresponding to i and longitude corresponding to j
#       data[0][0] is data at (const_min_latitude, const_min_longitude)
#       data[const_latitude_npoints - 1][const_longitude_npoints] is data at (const_max_latitude, const_max_longitude)
#       Points in between are evenly distributed
# Return value: None
def database_write(time, type, data):
    pass


############ READ: this part is only necessary for read operations ########################

# Returns the time range for which data is available
# Parameters: None
# Return value:
#   min_time, max_time:
#       type: datetime.datetime, datetime.datetime
#       only data in [min_time, max_time) is available, note min_time is closed bound while max_time is open
def database_bound():
    pass


# Read data from the database
# Parameters:
#   time:
#       type: datetime.datetime
#       the time slice we want to read, this must be within the bounds obtained by database_bound, or an Exception
#       will be thrown
#   type:
#       type: string, indexed by const_data_type
#       the type of data we want to read
#   min_lat, min_lng, max_lat, max_lng:
#       type: float or double
#       max_lat > min_lat and max_lng > max_lng
#   lat_npoints, lng_npoints
#       type: int
#       the number of sample points we want to obtain on each dimension
# Return value:
#   query_result:
#       type: numpy.ndarray, 2-dimensional float, size is (lat_npoints, lng_npoints)
#       data[i][j] is the value at latitude corresponding to i and longitude corresponding to j
#       data[0][0] is data at (min_lat, min_lng)
#       data[lat_npoints - 1][lng_npoints] is data at (max_lat, max_lng)
#       Points in between are evenly distributed
#       Any point not with boundary specified by const_max_latitude, etc will be set to nan
def database_read(time, type, min_lat, min_lng, max_lat, max_lng, lat_npoints, lng_npoints):
    """

    :rtype : object
    """
    query_result = numpy.random.uniform(low=0, high=100, size=(lat_npoints, lng_npoints));
    return query_result


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
    query_result = database_read(datetime.datetime.fromtimestamp(time_s), data_type, lat_min, lng_min, lat_max,
                                 lng_max, lat_npoints, lng_npoints);

    values = [];
    for i in range(0, lat_npoints):
        for j in range(0, lng_npoints):
            values.append(query_result[i][j]);

    return  HttpResponse(json.dumps({
        'values' : values
    }), content_type = 'application/json')
