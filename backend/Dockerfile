FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY seeds ./seeds

COPY docker-entrypoint-api.sh /docker-entrypoint-api.sh
RUN chmod +x /docker-entrypoint-api.sh

ENTRYPOINT ["/docker-entrypoint-api.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
