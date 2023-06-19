# Introduction

This file documents the overall functionalities of the project's components as they are developed.
- [Introduction](#introduction)
- [Docker Images](#docker-images)
  - [Building the Base Image: Node and Dependencies](#building-the-base-image-node-and-dependencies)
  - [Building the Base Image: Latex Installation](#building-the-base-image-latex-installation)
  - [Building the Base Image: Configuring the User](#building-the-base-image-configuring-the-user)
  - [Building latexquestionbank: Installing Node Dependencies](#building-latexquestionbank-installing-node-dependencies)
  - [Building latexquestionbank: Setting the Startup Scripts](#building-latexquestionbank-setting-the-startup-scripts)
  - [Building latexquestionbank: Startup](#building-latexquestionbank-startup)
  - [Building the Containers](#building-the-containers)


# Docker Images

## Building the Base Image: Node and Dependencies

We use the **phusion/Baseimage** image, found [here](https://github.com/phusion/baseimage-docker). This is a minimal Ubuntu image.
```
RUN apt-get update \
    && apt-get install -y build-essential wget perl

RUN curl -sSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs
```
- `perl` is a required dependency for `install-tl` and `tlmgr`.

## Building the Base Image: Latex Installation

```
RUN wget https://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz \
    && mkdir /texlive-installer
    && tar -xzf install-tl-unx.tar.gz -C /texlive-installer \
    && rm install-tl-unx.tar.gz* \
```
- `wget`: Downloads texlive installer from mirror
- `tar`: `x` extracts, `z` filters through gzip2, `f` sets the filename, and `C` sets the destination directory

```
    && cd texlive-installer \
    && echo "selected_scheme scheme-basic" >> texlive.profile \ 
    && echo "tlpdbopt_install_docfiles 0" >> texlive.profile \ 
    && echo "tlpdbopt_install_srcfiles 0" >> texlive.profile \
    && echo "tlpdbopt_autobackup 0" >> texlive.profile \
    && cd .. \
    && /texlive-installer/install-tl -profile texlive.profile \
    && $(find /usr/local/texlive -name tlmgr) path add
    && rm -rf /texlive-installer
```
- `install-tl` profile setup: do not install documentation and source files, do not autobackup, only install the basic scheme
- Texlive is installed at `/usr/local/texlive` using the aforementioned profile
- The Texlive binary, at `/usr/local/texlive/2023/bin/x86_64-linux/tlmgr`, is added to the system PATH (and can now be executed simply with `tlmgr`)

[Overleaf's base Texlive image](https://github.com/overleaf/overleaf/blob/main/server-ce/Dockerfile-base)

[StackExchange: Minimal Dockerised Texlive installation](https://tex.stackexchange.com/questions/397174/minimal-texlive-installation)

Other references:

[Install Texlive](https://www.tug.org/texlive/quickinstall.html)

[install-tl Reference](https://www.tug.org/texlive/doc/install-tl.html)

[tlmgr Reference](https://tug.org/texlive/tlmgr.html)

[Texlive Guide](https://www.tug.org/texlive/doc/texlive-en/texlive-en.html#x1-420004.2)

## Building the Base Image: Configuring the User

We create a new user `node`, with home directory `/app`, and set it as the owner of the `/app` directory. 
```
RUN adduser --system --home /app node
RUN chown -R node /app
```
This user does not have sudo privileges, and `node` will run as this user.

## Building latexquestionbank: Installing Node Dependencies
```
ENV NODE_ENV=production
WORKDIR /app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
```

## Building latexquestionbank: Setting the Startup Scripts
```
RUN mv /app/startup_scripts/* /etc/my_init.d
RUN chmod +x /etc/my_init.d/*
```
The **phusion/Baseimage** image will perform the following, in sequence, on startup:
- Runs all system startup files, which are stored in `/etc/my_init.d`
- Starts all runit services.
- Runs the specified command in `CMD`.
- When the specified command exits, stops all runit services.

## Building latexquestionbank: Startup
```
EXPOSE 3000
CMD ["/sbin/my_init", "--", "setuser", "node", "npm", "start"]
```
- Expose the container's port 3000
- Run `/sbin/my_init` to start the container. This executes the specified command that appears after the double dashes.
- `setuser` will execute the specified command `npm start` as the user `node`.

## Building the Containers

To build **latexbase**, execute `make latex-base` in `/`.

To build **latexquestionbank**, execute `docker compose build` in `/server`.