FROM public.ecr.aws/amazonlinux/amazonlinux:2023

# Install necessary system tools and Python 3.12
RUN dnf update -y && \
    dnf install -y \
        gcc \
        gcc-c++ \
        cmake \
        openblas-devel \
        python3.12 \
        python3.12-devel \
        python3.12-pip \
        make \
        git \
        zip \
        findutils


RUN alternatives --install /usr/bin/python python /usr/bin/python3.12 1 && \
    alternatives --install /usr/bin/pip pip /usr/bin/pip3.12 1

RUN git clone --recurse-submodules https://github.com/abetlen/llama-cpp-python.git /llama-cpp-python
WORKDIR /llama-cpp-python
RUN make clean

RUN CMAKE_ARGS="-DGGML_CCACHE=OFF -DGGML_BLAS=ON -DGGML_BLAS_VENDOR=OpenBLAS FORCE_CMAKE=1" \
    pip install --upgrade pip && \
    pip install --target ../build .

WORKDIR /build
COPY requirements.txt .

RUN pip install --no-cache-dir --target . -r requirements.txt

RUN cp /usr/lib64/libgomp.so.1 /build/lib64/libgomp.so.1 && cp /usr/lib64/libc.so.6 /build/lib64/liblibc.so.6

# Package the whole thing as a Lambda-compatible zip
RUN mkdir -p /output
RUN cd ../build
CMD ["zip", "-r", "../output/ai-service.zip", ".", "-x", "*__pycache__/*"]
