FROM debian:jessie
ARG PROXY_URL
ARG SKYTAP_USER
ARG SKYTAP_TOKEN

RUN if [ -z ${PROXY_URL+x} ]; then echo "####PROXY_URL NOT SET####"; \
else \
	export http_proxy=$PROXY_URL \
	&& export https_proxy=$PROXY_URL \
	&& echo "----OS PROXY SET----"; \
fi

#SET ENVIRONMENTAL VARIABES
ENV http_proxy=$PROXY_URL \
	https_proxy=$PROXY_URL \
	NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist \
	NODE_VERSION=6.5.0 \
	NVM_DIR=/root/.nvm \
	PYTHON=/usr/bin/python2.7 \
	NODE_PATH=$NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
	
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

#CREATE DIRS
RUN mkdir /home/deployweb

RUN echo "oracle-java8-installer shared/accepted-oracle-license-v1-1 select true" | /usr/bin/debconf-set-selections \
	&& apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
	&& echo "deb http://download.mono-project.com/repo/debian wheezy/snapshots/4.2.4 main" | tee /etc/apt/sources.list.d/mono-xamarin.list \
	&& echo "deb http://download.mono-project.com/repo/debian wheezy-apache24-compat main" | tee -a /etc/apt/sources.list.d/mono-xamarin.list \
	&& echo "deb http://download.mono-project.com/repo/debian wheezy-libjpeg62-compat main" | tee -a /etc/apt/sources.list.d/mono-xamarin.list \
	&& echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee /etc/apt/sources.list.d/webupd8team-java.list \
	&& echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list \
	&& apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886 \

	&& apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y \
		git \
		wget \
		curl \
		build-essential \
		python2.7 \
		python \
		oracle-java8-installer \
		mono-devel 

#INSTALL NODE
RUN rm /bin/sh && \ 
	ln -s /bin/bash /bin/sh \
	&& wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh --no-check-certificate | bash \
	&& /bin/bash -c "source /root/.bashrc && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION"



#CONFIGURE GIT
RUN if [ -z ${PROXY_URL+x} ]; then echo "####NO PROXY URL SET####"; \
else \
	git config --global http.proxy $PROXY_URL \
	&& git config --global https.proxy $PROXY_URL  \
	&& echo "----GIT PROXY SET----"; \
fi

RUN git config --global url."http://".insteadOf git:// \
	&& git config --global http.savecookies true

#CONFIGURE NPM
RUN if [ -z ${PROXY_URL+x} ]; then echo "####NO PROXY URL SET####"; \
else \
	npm config set proxy $PROXY_URL \
	&& npm config set https-proxy $PROXY_URL \
	&& echo "----NPM PROXY SET----"; \
fi

RUN npm install node-gyp bower -g

#GET CODE
WORKDIR /home/deployweb
RUN git clone https://github.com/fti-technology/ringtail-deploy-web.git
WORKDIR ringtail-deploy-web
RUN mkdir data

#SETUP CONFIG
RUN cp config.js.example config.js

RUN npm install --only=production \
	&& bower install --allow-root \
	&& touch start.sh && chmod +x start.sh \
	&& echo "DEBUG=deployer* npm start" >> start.sh

ENV http_proxy=""
ENV https_proxy=""

#EXPOSE PORTS
EXPOSE 8080 5858

#START APP
CMD [  "sh", "start.sh" ]
