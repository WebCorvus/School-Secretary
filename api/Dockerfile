FROM python:3.11-slim-bullseye

WORKDIR /api

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN mkdir -p /api/users/management/commands
COPY users/management/commands /api/users/management/commands

EXPOSE 8000
