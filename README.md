# Microservices

## Endpoints

### APISIX

* Dashboard [http://127.0.0.1:9080/apisix/dashboard](http://127.0.0.1:9080/apisix/dashboard)
* Rest API [http://127.0.0.1:9080/apisix/admin/<endpoint>](http://127.0.0.1:9080/apisix/admin/)

### Consul
 * Dashboard [http://localhost:8500/ui](http://localhost:8500/ui)

## Gateway

## Development Guide

#### General

* Run `docker-compose up`
* Vì lý do security, có thể sẽ bắt buộc cần sudo trên Ubuntu `sudo docker-compose up`.

#### Time0 (lấy làm ví dụ)

* Vào `samples/time0`
* Run `yarn install`

#### Tạo nhiều Instants của Time0 .

>  - Có thể giữ nguyên địa chỉ IP.
>  - Tìm **const GATEWAY_ROUTES_ENDPOINT** và đổi số ID ở cuối URI ***(số nàylà duy nhất sẽ được đăng ký thể hiện trong APISIX Dashboard)***.
>  - Tìm **axios.put(GATEWAY_ROUTES_ENDPOINT** và đổi URL /time0 thành một tên khác cho Instant ***(tên này là duy nhất và cũng sẽ được đăng ký và thể hiện trong APISIX Dashboard và Consul UI)***.
>  - Run `PORT=3000 node server.js` <- Đổi port 3000 thành một port khác để đảm bảo cho Instant mới.
    
### Run Test
* **Postman** or **URI** ***On Explorer*** for test Service through APISIX Gatewaty: `http://localhost:9080/time0`

## Troubleshooting

### Ubuntu

* Replace `host.docker.internal` with `localhost` or Docker host IP or **172.17.0.1** for this sample.

### Note change project

* Copy `.docker` folder, and paste it to project new, if use to `docker`
