FROM python:3.11-slim-bullseye

COPY . /usr/bin/app/
WORKDIR /usr/bin/app/

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "runserver"]
