from django.shortcuts import render

def home(request):
    return render(request, "home.html")

def map_game(request):
    return render(request, "game.html", {"mode": "map"})

def flag_game(request):
    return render(request, "game.html", {"mode": "flag"})
