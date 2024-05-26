# install node
ARG NODE_VERSION=18.18.0
FROM node:${NODE_VERSION}

# set working directory
WORKDIR /app

# copy package files
COPY package.json .
COPY pnpm-lock.yaml .

# install pnpm
ARG PNPM_VERSION=8.9.2
RUN npm install -g pnpm@${PNPM_VERSION}

# install dependencies
RUN pnpm install --frozen-lockfile --shamefully-hoist

# copy source code (see .dockerignore for ignored files)
COPY . .

# build app
RUN pnpm build

# expose port
EXPOSE 3000

# start app
CMD [ "node", ".output/server/index.mjs" ]
