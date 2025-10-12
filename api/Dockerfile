FROM python:3.11-alpine3.22

WORKDIR /api

RUN apk add --no-cache curl

RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

COPY pyproject.toml .
RUN uv sync

COPY entrypoint.sh /entrypoint.sh
RUN chmod u+x /entrypoint.sh

COPY . .

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
