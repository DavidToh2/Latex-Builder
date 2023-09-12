# Introduction

Latex web-app capable of linking and compiling LaTeX code to build PDF documents from a server-side LaTeX installation and question database.

Website is now live at [towelet.app](https://towelet.app)!

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
- [Server Documentation Hub](./server/README.md)
  - [Setup](./documentation/server/Setup.md)
  - [Dockerfile Config](./documentation/server/Dockerfile%20Config.md)
  - [Database](./documentation/server/Database.md)
  - [Networking](./documentation/server/Networking.md)
  - [Authentication](./documentation/server/Authentication.md)
  - [Error Handling](./documentation/server/Error%20Handling.md)
  - [LaTeX](./documentation/server/LaTeX.md)
- [Frontend Documentation Hub](./vue-frontend/README.md)
  - [Networking](./documentation/vue-frontend/Networking.md)
  - [Authentication](./documentation/vue-frontend/Authentication.md)
- [Development](./documentation/development)
  - [Testing Environment](./documentation/development/Testing%20Environment.md)
- [Production](./documentation/production)
  - [Frontend](./documentation/production/Frontend.md)
  - [Backend](./documentation/production/Backend.md)
  - [Networking](./documentation/production/Networking.md)
    - [Networking: A primer](./documentation/production/Networking:%20A%20primer.md)
  - [AWS IAM](./documentation/production/AWS%20IAM.md)
  - [Email Service](./documentation/production/Email%20Service.md)