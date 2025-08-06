FROM python:3.11-slim-bullseye

COPY . /usr/src/backend/
WORKDIR /usr/src/backend/

RUN pip install -r requirements.txt
RUN python manage.py makemigrations
RUN python manage.py migrate

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
