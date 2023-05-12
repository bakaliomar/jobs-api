FROM node:19-alpine as development

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY prisma ./prisma/

RUN yarn install

RUN npx prisma generate
# RUN npx prisma migrate dev --name base-setup  init
COPY . .
RUN yarn run build


FROM node:19-alpine as production


COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./
COPY --from=development /app/yarn.lock ./
COPY --from=development /app/dist ./dist
COPY --from=development /app/.env ./.env

EXPOSE 3333

CMD ["yarn", "run", "start:prod"]

#docker build -t borda-backend .