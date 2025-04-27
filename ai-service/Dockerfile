FROM python:3.12-slim

# Install node (needed for Serverless framework)
RUN apt-get update && apt-get install -y \
        build-essential \
        gcc \
        g++ \
        cmake \
        libopenblas-dev \
        python3-dev \
        git \
        curl  \
        gnupg &&\
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

WORKDIR /app

COPY ./app ./app
COPY ./app/package.json ./app/package.json
COPY ./model ./model
COPY ./knowledge-base ./knowledge-base
COPY requirements.txt .
COPY app/serverless.yml .

RUN pip install llama-cpp-python --config-settings cmake.args="-DGGML_CCACHE=OFF -DCMAKE_CXX_STANDARD=17 -DGGML_BLAS=ON;-DGGML_BLAS_VENDOR=OpenBLAS" \
    && pip install --no-cache-dir -r ./requirements.txt

WORKDIR /app/app
RUN npm cache clean --force && npm install --prefer-online --legacy-peer-deps

CMD ["npm", "run", "--prefix", "/app/app", "dev"]