# Implementando [X-Ray de AWS](https://aws.amazon.com/es/xray/) con API de Node.js y Express

AWS X-Ray es un servicio que recopila datos sobre las solicitudes que atiende tu aplicación y proporciona herramientas para ver, filtrar y obtener información detallada sobre esos datos. Esto te ayuda a identificar problemas y oportunidades de optimización en tu aplicación. [Aquí](https://docs.aws.amazon.com/es_es/xray/latest/devguide/aws-xray.html) puedes encontrar más información sobre AWS X-Ray.

Para una guía detallada sobre la implementación de X-Ray en Node.js, consulta la [documentación oficial](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs.html).

## Implementación

1. **Estructura de la aplicación**: Utiliza la plantilla proporcionada para construir una API básica con Node.js y Express. Puedes encontrar una plantilla básica [aquí](https://github.com/bryanSolares/simple-skeleton-backend-nodejs-express).

2. **Credenciales de AWS**: Asegúrate de tener credenciales de AWS, como [Access Key de AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html), configuradas en tu entorno. Estas credenciales se utilizarán tanto dentro de la aplicación como por el Daemon de X-Ray para enviar información a AWS X-Ray. Asegúrate de asignar a estas credenciales un usuario con los privilegios mínimos necesarios.

```
aws configure
```

3. **Daemon de X-Ray**: Instala y ejecuta el Daemon de X-Ray localmente o mediante un [contenedor de Docker](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-local.html). Se proporciona un Dockerfile con las configuraciones necesarias para crear una imagen del Daemon.

```
docker build -t xray-daemon .
```

4. **Ejecución del Daemon**: Ejecuta un contenedor utilizando la imagen del Daemon de X-Ray. Asegúrate de montar tus credenciales de AWS como un volumen relacionado con el contenedor.

```
docker run  --attach STDOUT  -v ~/.aws/:/root/.aws/:ro  --net=host -e AWS_REGION=<region>  --name <name-container> -p 2000:2000/udp  xray-daemon -o
```

5. **Inicio de la API**: Inicia tu API y utiliza los endpoints que están instrumentados con X-Ray.

```
npm run dev
```

```
# Endpoints
http://localhost:3500/aws
http://localhost:3500/aws/aws-sdk
http://localhost:3500/aws/http-request
http://localhost:3500/aws/mysql
http://localhost:3500/aws/error
```

## Contexto de código

Cada uno de los endpoint instrumentados, generarán información hacía el Daemon de X-Ray.

-   El primer endpoint renderiza un HTML al usuario. Dentro del proceso antes de renderizar se crea un sub-segmento para el segmento principal, donde se añade información relacionada a Anotaciones, Metadatos. Considera que las Anotaciones son indexables y son utilizadas para realizar querys de consulta en la consola de AWS X-Ray.
-   El segundo endpoint hace uso de nuestras credenciales de AWS para consultar las tablas de DynamoDB que existen según la región existente en las variables de entorno.
-   El tercer endpoint registra cuál es el resultado de interactura con una dirección HTTPS externa.
-   El cuarto endpoint hace uso de una conexión a MySQL, mostrando como resultado al usuario la consulta a cierta tabla configurada en las variables de entorno. Este endpoint está instrumentado con X-Ray de tal forma que cuando existe un error en la conexión, éste sea registrado en un nuevo sub-segmento, añadiendo anotaciones y registrado el error generado.
-   Finalmente el quinto endpoint hace el registro de un error controlado, evidenciando y dejando información en un sub-segmento, sobre lo que ha pasado.

## Consideraciones adicionales

-   Asegúrate de configurar correctamente las variables de entorno.
-   Si no tienes una base de datos MySQL disponible, considera crear un contenedor [Docker con MySQL](https://hub.docker.com/_/mysql) para mayor facilidad.
-   Configura tus credenciales de AWS tanto en tu máquina local como en las variables de entorno.
