######## Development 환경 ########
FROM node:slim AS development

RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  libvips-dev \
  && rm -rf /var/lib/apt/lists/*

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

COPY apps/e-signature apps/e-signature
COPY libs libs

RUN pnpm build e-signature

# 커맨드 실행
CMD [ "pnpm", "start:dev", "e-signature" ]

######## Production 환경 ########
FROM node:slim AS production

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

CMD ["node", "dist/apps/e-signature/main"]