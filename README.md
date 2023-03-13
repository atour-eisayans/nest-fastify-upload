## Packages

These packages have been installed and implemented:

```bash

# to handle requests with content-type: multipart/form-data
@fastify/multipart

# to show uploaded files as static ones
@fastify/static

# to create mock variables from existing types
@golevelup/ts-jest

# to implement fastify server
@nestjs/platform-fastify

```

## Fastify

multipart and static plugins for the fastify have been registered in the main.ts file

## Module

A module called **upload** has been added which has a route where you can upload your files within /upload endpoint

### Guarde

This guard is responsible for checking the content-type of incoming request. If it is multipart/form-data, it will allow to request goes on with its process

### Interceptor

This is the main place where the files get uploaded. This interceptor cycles over the files attached to request object and write them one by one. After that, it sends the saved files names in the response body.

The files path depends on their key name which they have been sent by it, but the main directory for uploaded files is a folder called `uploads` where it will have sub-folders when files getting uploaded.

At the moment, we didn't implement any logic for the files type validation but there is a limit for the files size which has been set to 1,000,000 bytes whitin the multipart plugin registration to fastify server in main.ts file.

