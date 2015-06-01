import json
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext

from mapview.data import lng, lat, count, pointnumber

def get_data(request):
    data_list = []
    for i in range(pointnumber):
        data_list.append({
            'lng' : lng(),
            'lat' : lat(),
            'count' : count(),
            })
    return HttpResponse(json.dumps({
        'result' : 0,
        'data_list' : data_list
    }), content_type = 'application/json')


def index(request):
    if request.is_ajax() and request.method == 'POST' :
        action_type = request.POST.get('type')
        if action_type == 'getdata' :
            return get_data(request)
    return render_to_response(
        'map_view.html', {
            })
def new_index(request):
    return render_to_response(
        'new_index.html', {
            })
def about(request):
    return render_to_response(
        'about.html', {
            })
def contact(request):
    return render_to_response(
        'contact.html', {
            })
