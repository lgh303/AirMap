__author__ = 'glglwty'

from socket import socket
from datetime import datetime, timedelta
from time import time
import sys
from math import ceil, floor
import json

def read_lines(sock, recv_buffer=40960, delim='\n'):
    buffer = ''
    data = True
    while data:
        data = sock.recv(recv_buffer)
        buffer += data.decode("utf-8")
        while buffer.find(delim) != -1:
            line, buffer = buffer.split('\n', 1)
            yield line
    return


def time_conv(time, starttime, minutes_per_tick):
    return int((time-starttime).total_seconds()/60/minutes_per_tick)

# This file defines all functions offered by the front-end database
import numpy

############ ALL: this part is necessary for both read and write operations ##################

class DbError(BaseException):
    def __init__(self, msg):
        self.msg = msg


# These constants define the bounds on the data the database may offer
const_min_latitude = 18.26
const_max_latitude = 52.95
const_min_longitude = 74.92
const_max_longitude = 134.3

# Types of data that can be written into or read from the database
const_data_type = { #'PM2.5': 0,
                    'AQI': 1,
                    'temperature': 2,
                    'wind': 3,
                    #'wind_east_component': 4,
                     'humid': 5,
                     'rain': 6
                    }

# The minimum time interval in minutes, this is guaranteed to divide 60(1h), all 'time' parameters in queries must
# be a integer multiple of this (i.e. 2015.5.2, 12:40 is valid if const_time_interval = 20, 2015.5.2, 12:41 is not)
const_time_interval = 60


############ WRITE: this part is only necessary for write operations ########################

# The resolution of the data slice that will be written into the database
const_latitude_npoints = 693
const_longitude_npoints = 1187

# The earlist time of data that could be written, the first datawrite for any type must be this time
const_start_time = datetime(2015, 5, 12, 0, 0)
# Write a time slice of data into the database
# Parameters:
#   time:
#       type: ime
#       the time slice we want to write, this must be continuous with the same type of data we have already written
#   type:
#       type: string, indexed by const_data_type
#       the type of data we want to write
#   data:
#       type: numpy.ndarray, must be 2-dimensional
#       data[i][j] is the value at latitude corresponding to i and longitude corresponding to j
#       data[0][0] is data at (const_min_latitude, const_min_longitude)
#       data[const_latitude_npoints - 1][const_longitude_npoints] is data at (const_max_latitude, const_max_longitude)
#       Points in between are evenly distributed
# Return value: None
def database_write(time, _type, data):
    assert(type(time) is datetime)
    print(data.shape)
    assert(data.shape == (const_latitude_npoints, const_longitude_npoints))
    sock = socket()
    try:
        gen = read_lines(sock)
        sock.connect(('123.57.189.143', 9123 + const_data_type[_type]))
        data_str = ""
        for i in data:
            for j in i:
                data_str += str(j) + " "
        cmd = {"variant": "Write", "fields": [{"t": str(time_conv(time, const_start_time, const_time_interval)), "data": data_str}]}
        send = bytes((str(cmd) + "\n").replace('\'', "\""))
        sock.sendall(send)
        res = json.loads(gen.next())
        if res['retcode'] != 0:
            print(res['payload'])
            raise DbError(res['payload'])
    finally:
        sock.close()
    return res['payload']


############ READ: this part is only necessary for read operations ########################

# Returns the time range for which data is available
# Parameters: None
# Return value:
#   min_time, max_time:
#       type: datetime.datetime, datetime.datetime
#       only data in [min_time, max_time) is available, note min_time is closed bound while max_time is open
def database_bound(_types=[]):
    cmd = b'{"variant":"MaxT","fields":[{}]}\n'
    minv = sys.maxsize

    for _type in _types or const_data_type:
        sock = socket()
        try:
            gen = read_lines(sock)
            sock.connect(('123.57.189.143', 9123 + const_data_type[_type]))
            sock.sendall(cmd)
            res = json.loads(gen.next())
            if res['retcode'] != 0:
                raise DbError(res['payload'])
            minv = min(minv, int(res['payload']))
        finally:
            sock.close()
    return const_start_time, const_start_time + timedelta(minutes=const_time_interval * minv)

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
#       all these must be STRICTLY within the bounding box set by const_min_latitude, etc,
#           exceptions will be thrown if not
#       max_lat > min_lat and max_lng > max_lng
#   lat_npoints, lng_npoints
#       type: int
#       the number of sample points we want to obtain on each dimension
# Return value:
#   query_result:
#       type: numpy.ndarray, 2-dimensional, size is (lat_npoints, lng_npoints)
#       data[i][j] is the value at latitude corresponding to i and longitude corresponding to j
#       data[0][0] is data at (min_lat, min_lng)
#       data[lat_npoints - 1][lng_npoints - 1] is data at (max_lat, max_lng)
#       Points in between are evenly distributed

def database_read(_time, _type, min_lat, min_lng, max_lat, max_lng, lat_npoints, lng_npoints):
    assert(type(_time) is datetime)
    sock = socket()
    try:
        if min_lat >= const_min_latitude:
            min_lat_iter = 0
            x = (float(min_lat) - const_min_latitude) / (const_max_latitude - const_min_latitude) * float(const_latitude_npoints - 1)
        else:
            min_lat_iter = int(ceil((const_min_latitude - min_lat) * float(lat_npoints - 1) / (max_lat - min_lat)))
            lat = min_lat + float(min_lat_iter) / float(lat_npoints - 1) * (max_lat - min_lat)
            x = (float(lat) - const_min_latitude) / (const_max_latitude - const_min_latitude) * float(const_latitude_npoints - 1)

        if max_lat <= const_max_latitude:
            max_lat_iter = lat_npoints - 1
            h = (float(max_lat) - const_min_latitude) / (const_max_latitude - const_min_latitude) * float(const_latitude_npoints - 1)
        else:
            max_lat_iter = int(floor((const_max_latitude - min_lat) * float(lat_npoints - 1) / (max_lat - min_lat)))
            lat = min_lat + float(max_lat_iter) / float(lat_npoints - 1) * (max_lat - min_lat)
            h = (float(lat) - const_min_latitude) / (const_max_latitude - const_min_latitude) * float(const_latitude_npoints - 1)

        if min_lng >= const_min_longitude:
            min_lng_iter = 0
            y = (float(min_lng) - const_min_longitude) / (const_max_longitude - const_min_longitude) * float(const_longitude_npoints - 1)
        else:
            min_lng_iter = int(ceil((const_min_longitude - min_lng) * float(lng_npoints - 1) / (max_lng - min_lng)))
            lng = min_lng + float(min_lng_iter) / float(lng_npoints - 1) * (max_lng - min_lng)
            y = (float(lng) - const_min_longitude) / (const_max_longitude - const_min_longitude) * float(const_longitude_npoints - 1)

        if max_lng <= const_max_longitude:
            max_lng_iter = lng_npoints - 1
            w = (float(max_lng) - const_min_longitude) / (const_max_longitude - const_min_longitude) * float(const_longitude_npoints - 1)
        else:
            max_lng_iter = int(floor((const_max_longitude - min_lng) * float(lng_npoints - 1) / (max_lng - min_lng)))
            lng = min_lng + float(max_lng_iter) / float(lng_npoints - 1) * (max_lng - min_lng)
            w = (float(lng) - const_min_longitude) / (const_max_longitude - const_min_longitude) * float(const_longitude_npoints - 1)
        h -= x
        w -= y

        cmd = {"variant": "Query", "fields": [{"t": str(time_conv(_time, const_start_time, const_time_interval)),
                                               "x": x,
                                               "y": y,
                                               "h": h,
                                               "w": w,
                                               "hnp": max_lat_iter - min_lat_iter + 1,
                                               "wnp": max_lng_iter - min_lng_iter + 1}]}
        #print(x, y, h, w, min_lat_iter, max_lat_iter, min_lng_iter, max_lng_iter)
        gen = read_lines(sock)
        sock.connect(('123.57.189.143', 9123 + const_data_type[_type]))
        send = bytes((str(cmd) + "\n").replace('\'', "\""))

        sock.sendall(send)
        res = json.loads(gen.next())
        if res['retcode'] != 0:
            raise DbError(res['payload'])
        fetched_result = numpy.fromstring(res['payload'], dtype=float, sep=" ").reshape((max_lat_iter - min_lat_iter + 1, max_lng_iter - min_lng_iter + 1))
        #print(fetched_result)
        assert(fetched_result.shape == (max_lat_iter - min_lat_iter + 1, max_lng_iter - min_lng_iter + 1))
        ret = numpy.full((lat_npoints, lng_npoints), numpy.nan)
        ret[min_lat_iter: max_lat_iter + 1, min_lng_iter: max_lng_iter + 1] = fetched_result
    finally:
        sock.close()
    return ret

#[ts, te)
def read_time_range(_type, ts, te, lat, lng):
    cmd = {"variant": "GetTimeRange", "fields": [{"ts": str(time_conv(ts, const_start_time, const_time_interval)),
                                           "te": str(time_conv(te, const_start_time, const_time_interval)),
                                               "x": lat,
                                               "y": lng,}]}

    sock = socket()
    gen = read_lines(sock)
    try:
        sock.connect(('123.57.189.143', 9123 + const_data_type[_type]))
        send = bytes((str(cmd) + "\n").replace('\'', "\""))
        sock.sendall(send)
        res = json.loads(gen.next())
        if res['retcode'] != 0:
            raise DbError(res['payload'])
        ret = [float(s) for s in res['payload'].strip().split(' ')]
    finally:
        sock.close()
    return ret



def test():
    data = numpy.array([[x + y for x in range(0, const_longitude_npoints)] for y in range(0, const_latitude_npoints)])
    print(data.shape)
    print(database_write(const_start_time, 'AQI', data))
    print(database_bound(['AQI']))
    a = time()
    rr = database_read(const_start_time, 'AQI', 12, 80, 22, 120, 1000, 1000)
    print(time() - a)
    print(rr)


def config():
    with open("startup.sh", 'w') as script_fd:
        script_fd.write("#!/bin/bash\n")
        for key in const_data_type:
            with open("config_" + key + ".json", 'w') as config_fd:
                config_fd.write('{"listen_address_port":"123.57.189.143:' + str(9123 +
                                                                           const_data_type[key]) +
                                '","blksize":4096,"block_1d_nelems":32,'
                                '"scales":[')
                for i in range(0, 5):
                    config_fd.write('{"hnp":' + str(const_latitude_npoints / 2**i))
                    config_fd.write(',"wnp":' + str(const_longitude_npoints / 2**i) + "}")
                    if i != 4:
                        config_fd.write(',')
                config_fd.write('],'
                                '"db_path":"db_' + key + '","db_info_path":"dbinfo_' + key + '.json"}')
            with open("dbinfo_" + key + '.json', 'w') as dbinfo_fd:
                dbinfo_fd.write('{"ntimes":0}')
            with open("db_" + key, 'w') as db_fd:
                db_fd.write(":)")
            script_fd.write("target/release/hello_world config_" + key + ".json > " + key +".log &\n")

def start():
    processes = []
    import subprocess
    subprocess.call(['cargo', 'build', '--release'])
    for key in const_data_type:
        processes.append(subprocess.Popen(['target/release/hello_world', 'config_' + key + ".json"]))
    return processes


def config_and_test():
    ps = []
    try:
        config()
        ps = start()
        test()
    finally:
        for p in ps:
            p.terminate()

def debug():
    read_time_range('AQI', const_start_time, datetime(2015, 5, 13, 0, 0), 30, 80)

if __name__ == "__main__":
    debug()