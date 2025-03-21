from django.http import HttpResponse

def Home (resquest):
    return HttpResponse('<h1>Home Page<h1/>')