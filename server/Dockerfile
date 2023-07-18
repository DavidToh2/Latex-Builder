FROM latexbase
ENV NODE_ENV=production

# Install node dependencies
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .

# Move startup scripts
RUN mv /app/startup_scripts/* /etc/my_init.d
RUN chmod +x /etc/my_init.d/*

RUN mv /app/public/packages/* /usr/local/texlive/texmf-local/tex/latex/local
RUN chmod +r /usr/local/texlive/texmf-local/tex/latex/local/*
RUN texhash

# Configure the node user
RUN chown -R node /app \
    && chmod -R +x /app/src/scripts \
    && chmod -R 700 /app/public/files

EXPOSE 3000

CMD ["/sbin/my_init", "--", "setuser", "node", "npm", "start"]
# https://github.com/phusion/baseimage-docker/issues/264#issuecomment-162853995
# setuser is a custom command that runs bash using node.
