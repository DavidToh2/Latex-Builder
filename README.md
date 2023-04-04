# Introduction

Latex building web-app capable of linking and compiling LaTeX code to build PDF documents from a server-side LaTeX installation and question database.

# Project structure

Front-end:
- NodeJS, Vue
- Styling: vanilla CSS for now, plan to integrate SASS in the future
- Scripting: TypeScript

Server:
- Base Image: [phusion/baseimage](https://github.com/phusion/baseimage-docker)
- Intermediate Image: natively installs NodeJS + TeXLive
- Routing: ExpressJS

Database:
- Mongoose/MongoDB

Hosting:
- Hosted on Azure (TBD)

More details [here](./documentation/SETUP.md)