from school.models import Subject


def get_subject_names():
    return list(Subject.objects.values_list("full_name", flat=True))
