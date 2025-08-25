FROM python:3.11-slim-bullseye

WORKDIR /api

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
