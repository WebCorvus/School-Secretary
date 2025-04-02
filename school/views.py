from django.shortcuts import render
from django.http import HttpResponse


def Home(request):
    render(request, "index.html")
