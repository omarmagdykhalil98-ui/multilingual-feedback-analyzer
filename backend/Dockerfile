# ---- Base image ----
FROM python:3.11-slim

# ---- Working directory ----
WORKDIR /code

# ---- System dependencies ----
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
 && rm -rf /var/lib/apt/lists/*

# ---- Copy dependency list ----
COPY ./requirements.txt /code/requirements.txt

# ---- Install Python dependencies ----
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r /code/requirements.txt

# ---- Copy application code ----
COPY ./app /code/app

# ---- Expose port ----
EXPOSE 80

# ---- Run FastAPI app ----
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
