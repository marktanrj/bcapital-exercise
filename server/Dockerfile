FROM node:22.13.0 as build

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:22.13.0-alpine3.20

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

COPY package.json pnpm-lock.yaml ./

EXPOSE 4000