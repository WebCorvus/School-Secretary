#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

import os
import sys
import warnings

# Suprimir warnings de timezone do Django em dev
if os.environ.get("DJANGO_SUPPRESS_TZ_WARNING", "1") == "1":
    warnings.filterwarnings(
        "ignore",
        message="DateTimeField .* received a naive datetime while time zone support is active.",
        category=RuntimeWarning,
    )


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'School-Secretary.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
