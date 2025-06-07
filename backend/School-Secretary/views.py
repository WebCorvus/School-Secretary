from django.http import HttpResponse
from django.shortcuts import render


def Home(resquest):
    return HttpResponse(render(resquest, "index.html"))
