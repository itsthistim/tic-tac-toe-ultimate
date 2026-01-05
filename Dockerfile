FROM node:20-slim AS base

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN npm run build

FROM base AS final
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/tsconfig.json ./tsconfig.json

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "server:prod"]
