#!/usr/bin/env python3
import urllib.request
import sys

try:
    r = urllib.request.urlopen("http://localhost:8000/api/admin/login/")
    sys.exit(0 if r.status < 500 else 1)
except Exception:
    sys.exit(1)
