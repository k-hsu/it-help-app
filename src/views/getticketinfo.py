from textwrap import indent
from src.models import *
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from src.models import *
from django.http import JsonResponse
from django.forms.models import model_to_dict
import json
from django.core.serializers.json import DjangoJSONEncoder
from itertools import chain
from django.core import serializers


'''
ticketResult get all the values for the ticket clicked
userResult gets the user who created this ticket
techResults gets one or more, if any techs are assigned to this ticket
commetResults gets the values for message, username, user_group, user_group and date entered
        sorted by date entered for better readability 
result joins the querysets together
'''
@login_required(login_url='/login')
def as_view(request):
        if request.method == 'POST':
                ticketResult = Ticket.objects.filter(ticketNum=request.POST["ticketNum"])
                userResult = Profile.objects.filter(user_ticket=request.POST["ticketNum"]).filter(user_group='U')
                techResult = Profile.objects.filter(user_ticket=request.POST["ticketNum"]).filter(user_group='T')
                commentResult = Comment.objects.filter(ticketNum=request.POST["ticketNum"]).order_by('date_entered')
                result = chain(ticketResult.values(),
                        userResult.values('username_id__username', 'user_group'),
                        techResult.values('username_id__username', 'user_group'),
                        commentResult.values('message', 'user__username', 'user__profile__user_group', 'date_entered'))      
                jsonReturn = json.dumps(list(result), indent = 2, default = str)
                return JsonResponse(jsonReturn, safe=False)
