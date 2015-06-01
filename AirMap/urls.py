from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin

urlpatterns = patterns(
    '',
    (r'^dataServer$', 'mapview.database.dataServer'),
    (r'^$', 'mapview.views.index'),
    (r'^new_index/$', 'mapview.views.new_index'),
    (r'^about/$', 'mapview.views.about'),
    (r'^contact/$', 'mapview.views.contact'),
) + static(settings.STATIC_URL)
