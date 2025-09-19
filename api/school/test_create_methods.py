from rest_framework.response import Response
from utils.inconsistency_logger import log_inconsistency

def generic_create(viewset, request, form_name):
    serializer = viewset.get_serializer(data=request.data)
    if serializer.is_valid():
        viewset.perform_create(serializer)
        return Response(serializer.data, status=201)
    else:
        user = request.user if hasattr(request, 'user') and getattr(request.user, 'is_authenticated', False) else None
        log_inconsistency(
            user=user,
            form_name=form_name,
            error_type="ValidationError",
            error_message=str(serializer.errors),
            data_sent=request.data
        )
        return Response(serializer.errors, status=400)
