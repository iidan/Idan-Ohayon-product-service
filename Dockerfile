FROM node:22.8.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:alpine

COPY --from=build /app/dist/product-test/browser /usr/share/nginx/html

EXPOSE 80
