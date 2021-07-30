FROM node:14.17.3 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run webpack
CMD ["npm", "run", "start"]

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app /usr/share/nginx/html