import re
from django.core.exceptions import ValidationError
from validate_docbr import CPF


def cpf_validator(value):
    cpf = CPF()
    if not cpf.validate(value):
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
