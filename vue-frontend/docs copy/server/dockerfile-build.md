# Introduction

This file documents how the server Docker image is built.
- [Introduction](#introduction)
- [Dockerfile: latexbase](#dockerfile-latexbase)
  - [Node and Dependencies](#node-and-dependencies)
  - [Latex Installation](#latex-installation)
  - [Configuring the User](#configuring-the-user)
- [Dockerfile: latexquestionbank](#dockerfile-latexquestionbank)
  - [Installing Node Dependencies](#installing-node-dependencies)
  - [Setting the Startup Scripts](#setting-the-startup-scripts)
  - [Startup](#startup)
- [Build and Runtime](#build-and-runtime)
  - [Build Command](#build-command)
  - [Runtime Properties](#runtime-properties)
  - [Logs (TBA)](#logs-tba)


# Dockerfile: latexbase

## Node and Dependencies

We use the **phusion/Baseimage** image, found [here](https://github.com/phusion/baseimage-docker). This is a minimal Ubuntu image.
```
RUN apt-get update \
    && apt-get install -y build-essential wget perl

RUN curl -sSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs
```
- `perl` is a required dependency for `install-tl` and `tlmgr`.

## Latex Installation

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

After this, we need to **install Texlive packages** as well as **add executable Texlive binaries to the PATH**. This is documented under the [LaTeX](./LaTeX.md) file.

[Overleaf's base Texlive image](https://github.com/overleaf/overleaf/blob/main/server-ce/Dockerfile-base)

[StackExchange: Minimal Dockerised Texlive installation](https://tex.stackexchange.com/questions/397174/minimal-texlive-installation)

Other references:

[Install Texlive](https://www.tug.org/texlive/quickinstall.html)

[install-tl Reference](https://www.tug.org/texlive/doc/install-tl.html)

[tlmgr Reference](https://tug.org/texlive/tlmgr.html)

[Texlive Guide](https://www.tug.org/texlive/doc/texlive-en/texlive-en.html#x1-420004.2)

## Configuring the User

We create a new user `node`, with home directory `/app`.
```
RUN adduser --system --home /app node
```
This user does not have sudo privileges, and `node` will run as this user.

# Dockerfile: latexquestionbank

## Installing Node Dependencies
```
ENV NODE_ENV=production
WORKDIR /app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
```

## Setting the Startup Scripts
```
RUN mv /app/startup_scripts/* /etc/my_init.d
RUN chmod +x /etc/my_init.d/*
RUN chown -R node /app
```
The **phusion/Baseimage** image will perform the following, in sequence, on startup:
- Runs all system startup files, which are stored in `/etc/my_init.d`
- Starts all runit services.
- Runs the specified command in `CMD`.
- When the specified command exits, stops all runit services.

We also set `node` as the owner of the `/app` directory. 

## Startup
```
EXPOSE 3000
CMD ["/sbin/my_init", "--", "setuser", "node", "npm", "start"]
```
- Expose the container's port 3000
- Run `/sbin/my_init` to start the container. This executes the specified command that appears after the double dashes.
- `setuser` will execute the specified command `npm start` as the user `node`.

# Build and Runtime

## Build Command

To build **latexbase**, execute `make latex-base` in `/`.

To build **latexquestionbank**, execute `docker compose build` in `/server`.

## Runtime Properties

The **latexquestionbank** container has the following properties during runtime.
- Active directory: /app
- User: root

## Logs (TBA)

We use [winston](https://www.npmjs.com/package/winston)