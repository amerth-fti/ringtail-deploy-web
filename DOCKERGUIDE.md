##Using Docker
If you are on a corporate proxy, you may configure your dock proxies with the help of this link. http://www.netinstructions.com/how-to-install-docker-on-windows-behind-a-proxy/

You can also check out the official documentation for other operating systems. https://docs.docker.com/engine/installation/

While in the directory which contains the Dockerfile, you can run the docker build command using the snippet below. For any args you don't need to provide, elimate the line.

```sh
docker build \
  --build-arg PROXY_URL=[PROXY_IF_YOU_HAVE_ONE] \
  --build-arg SKYTAP_USER=[SKYTAP_USER] \
  --build-arg SKYTAP_TOKEN=[SKYTAP_TOKEN] \
  -t deploy-web .
```

If you are not behind a proxy and do not use SkyTap, you can simply build your project like this.

```sh
docker build -t deploy-web .
```

Initially you must create a volume which will persist data. This will keep your sqlite database and .migrate file intact between reboots. Without this, your database will be empty the next time you start the container. The .migrate file stores the state of which scripts have already been run against your db.

```sh
docker volume create --name deploywebdata
```

You can run the image as such. Please refer to the docker documentation for other ways to launch the container.

```sh
docker run -p 8081:8080 -t deploy-web
```

If you don't know your docker ip, you can run the below command. To access the running deployment-web server, go to http://DOCKER_IP:8081/

```sh
docker-machine ip default
```

This will run a detached process, mounted to the data volume, which will automatically restart the container if the machine restarts.

```sh
sudo docker run --restart=always -v deploywebdata:/home/deployweb/ringtail-deploy-web/data -d -p 80:8080 -t deploy-web 
```