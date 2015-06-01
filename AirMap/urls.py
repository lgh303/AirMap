from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin

urlpatterns = patterns(
    '',
    (r'^dataServer$', 'mapview.database.dataServer'),
    (r'^$', 'mapview.views.index'),
) + static(settings.STATIC_URL)
