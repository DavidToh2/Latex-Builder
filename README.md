# Introduction

Latex web-app capable of linking and compiling LaTeX code to build PDF documents from a server-side LaTeX installation and question database.

# Project structure

Front-end:
- NodeJS, Vue
- Styling: vanilla CSS, no libraries :) 
- Scripting: TypeScript

Server:
- Base Image: [phusion/baseimage](https://github.com/phusion/baseimage-docker)
- Intermediate Image `latexbase`: natively installs NodeJS + TeXLive
- Server Image `latexquestionbank`
- Routing: ExpressJS

Database:
- Mongoose + MongoDB Atlas

Hosting:
- Frontend on AWS S3 + Cloudfront
- Backend on AWS Lightsail

## Documentation
- [Server Documentation](./server/README.md)
- [Frontend Documentation](./vue-frontend/README.md)
- [Development](./documentation/Development.md)
- [Production](./documentation/production/Production.md)