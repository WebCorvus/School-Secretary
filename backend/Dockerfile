FROM python:3.11-slim-bullseye

COPY . /usr/bin/backend/
WORKDIR /usr/bin/backend/

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "runserver"]
