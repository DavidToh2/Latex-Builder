# Introduction

Latex web-app capable of linking and compiling LaTeX code to build PDF documents from a server-side LaTeX installation and question database.

Website is now live at [https://towelet.app](https://towelet.app)!

# Project structure

Front-end:
- NodeJS, Vue
- Styling: vanilla CSS, no libraries :) 
- Scripting: TypeScript
- Documentation subsite: Vitepress

Server:
- Base Image: [phusion/baseimage](https://github.com/phusion/baseimage-docker)
- Intermediate Image `latexbase`: natively installs NodeJS + TeXLive
- Server Image `latexquestionbank`
- Routing: ExpressJS

Database:
- Mongoose + MongoDB Atlas

Cloud Services:
- Frontend on AWS S3 + Cloudfront
- Backend on AWS Lightsail
- Documentation at static subsite [https://docs.towelet.app](https://docs.towelet.app) hosted on S3 (now live and embedded in main site!)
- Email service using AWS SES