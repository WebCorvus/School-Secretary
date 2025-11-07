from io import BytesIO

from django.http import HttpResponse
from django.template.loader import render_to_string

try:
    from xhtml2pdf import pisa

    HAS_XHTML2PDF = True
except ImportError:
    HAS_XHTML2PDF = False


def pdfgen(template, context, filename):
    html_string = render_to_string(template, context)

    if not HAS_XHTML2PDF:
        # Return HTML if PDF library is not available
        response = HttpResponse(html_string, content_type="text/html")
        return response

    pdf_buffer = BytesIO()
    pisa_status = pisa.CreatePDF(html_string, dest=pdf_buffer)
    if pisa_status.err:
        return HttpResponse("Error generating PDF", status=500)

    pdf_buffer.seek(0)
    response = HttpResponse(pdf_buffer, content_type="application/pdf")
    response["Content-Disposition"] = f"inline; filename={filename}"
    return response
