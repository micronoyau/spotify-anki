FROM node:18-alpine
ARG REACT_APP_FRONT_URL
ARG REACT_APP_BACK_URL
WORKDIR /app
COPY . .
RUN npm install -g serve
EXPOSE 3000
RUN npm run build
CMD ["serve", "-s", "build"]
