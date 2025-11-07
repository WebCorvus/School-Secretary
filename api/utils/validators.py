import re

from django.core.exceptions import ValidationError

try:
    from validate_docbr import CPF

    HAS_VALIDATE_DOCBR = True
except ImportError:
    HAS_VALIDATE_DOCBR = False


def cpf_validator(value):
    if HAS_VALIDATE_DOCBR:
        cpf = CPF()
        if not cpf.validate(value):
            raise ValidationError(
                ("%(value)s is not valid"),
                params={"value": value},
            )
    else:
        # Basic CPF validation without external library
        if not value or len(value) != 11 or not value.isdigit():
            raise ValidationError(
                ("%(value)s is not valid"),
                params={"value": value},
            )


def cep_validator(value):
    if not len(value) == 8:
        raise ValidationError(
            ("%(value)s is not valid"),
            params={"value": value},
        )

    pattern = re.compile(r"(\d){5}(\d){3}")
    if not re.match(pattern, value):
        raise ValidationError(
            ("%(value)s is not valid"),
            params={"value": value},
        )


def phone_validator(value):
    pattern = r"^\(\d{2}\) 9\d{4}-\d{4}$"
    if not re.match(pattern, value):
        raise ValidationError(
            ("%(value)s is not valid"),
            params={"value": value},
        )
