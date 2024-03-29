FROM phusion/baseimage:jammy-1.0.1

RUN echo $(pwd)

RUN apt-get update \
    && apt-get install -y build-essential wget perl

RUN curl -sSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

RUN wget https://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz \
    && mkdir texlive-install \
    && tar -xzf install-tl-unx.tar.gz -C texlive-install --strip-components=1 \
    && rm install-tl-unx.tar.gz \
    && cd texlive-install \
    && echo "selected_scheme scheme-basic" >> texlive.profile \ 
    && echo "tlpdbopt_install_docfiles 0" >> texlive.profile \ 
    && echo "tlpdbopt_install_srcfiles 0" >> texlive.profile \
    && echo "tlpdbopt_autobackup 0" >> texlive.profile \
    && echo "Starting LaTeX installation..." \
    && ./install-tl -profile texlive.profile \
    && $(find /usr/local/texlive -name tlmgr) path add \
    && cd .. \
    && rm -rf texlive-install 

RUN adduser --system --home /app node

RUN tlmgr install enumitem \
    && tlmgr install gensymb \
    && tlmgr install multirow \
    && tlmgr install caption \
    && tlmgr install mathtools \
    && tlmgr install dvisvgm \
    && tlmgr install dvipng \
    && tlmgr install pdfcrop

RUN tlmgr path add

RUN tlmgr info --only-installed --data name > latex-packages.txt