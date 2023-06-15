# Introduction

Latex web-app capable of linking and compiling LaTeX code to build PDF documents from a server-side LaTeX installation and question database.

# Project structure

Front-end:
- NodeJS, Vue
- Styling: vanilla CSS for now, plan to integrate SASS in the future
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
- Backend on AWS EC2

## Documentation
- [Setup](./documentation/SETUP.md)
- [Development](./documentation/DEVELOPMENT.md)
- [Data](./documentation/DATA.md)
- [Staging](./documentation/STAGING.md)
- [Production](./documentation/PRODUCTION.md)