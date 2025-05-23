######## Development 환경 ########
FROM node:alpine AS development

WORKDIR /usr/src/app

# copy package.json
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# install pnpm
RUN npm i -g pnpm

# install package
RUN pnpm i

COPY apps/notification apps/notification
COPY libs libs

RUN pnpm build notification

# 커맨드 실행
CMD [ "pnpm", "start:dev", "notification" ]

######## Production 환경 ########
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# copy package.json
COPY package.json ./
COPY pnpm-lock.yaml ./

# install pnpm
RUN npm install -g pnpm
# install package
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist
COPY proto proto

CMD ["node", "dist/apps/notification/main"]