FROM ubuntu:20.04

# Base needs
RUN apt update
RUN apt -y upgrade
RUN apt install -y curl unzip gnupg gnupg2 gnupg1

# install AWS
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

# Install Docker
RUN apt update
RUN apt install -y apt-transport-https ca-certificates curl software-properties-common
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
RUN apt-cache policy docker-ce
# RUN apt-get update -y
RUN apt-get install -y docker-ce docker-ce-cli containerd.io
RUN docker --version


# Notes:
# This file is used to build the run agent for my jenkins......cuz having an ec2 running and waiting to do things cost CASSSSH

# to make it run local with out docker.sock issue:
#-v /var/run/docker.sock:/var/run/docker.sock