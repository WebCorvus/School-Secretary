from django.contrib import admin
from .models import Subject, Itinerary, Group, Lesson, WeeklyLessonPlan, Grade, Presence, Enrollment

admin.site.register(Subject)
admin.site.register(Itinerary)
admin.site.register(Group)
admin.site.register(Lesson)
admin.site.register(WeeklyLessonPlan)
admin.site.register(Grade)
admin.site.register(Presence)
admin.site.register(Enrollment)
