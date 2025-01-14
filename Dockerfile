FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

ENV EMPLOYEE_URL=http://tecnoor.com.br:30082/employee

ENV APPOINTMENT_URL=http://tecnoor.com.br:30082/appointment

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=build /app/dist/scheduler-front /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

#CMD ["nginx.conf > /etc/nginx/conf.d/default.conf", "nginx", "-g", "daemon off;"]
CMD ["nginx", "-g", "daemon off;"]