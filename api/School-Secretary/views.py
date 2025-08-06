from django.shortcuts import render


def Home(resquest):
    return render(resquest, template_name="index.html")
