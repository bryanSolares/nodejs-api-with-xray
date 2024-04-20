# Proyecto base para API con NodeJS y ExpressJS

Esta base de proyecto brinda una forma simplificada de implementación de una API Rest con NodeJS y ExpressJS. El objetivo principal es poder brindar una forma fácil y rápida de iniciar un proyecto utilizando este esquema definido.
La personalización adicional dependerá del usuario final. Se brinda un esquema básico para el inicio del desarrollo sin preocuparse por configuraciones básica que pueden tomar un tiempo relativamente escencial.

## Prerequisitos
Tomar en consideración que se utilizar NodeJS en su versión 18.X. Se aconseja poder instalar esta versión para utilización de este esquema. A continuación se brinda una forma rápida de instalación utilizando un administrador de versión Node. [Node Version Manager](https://github.com/nvm-sh/nvm) brinda una forma rápida de poder administrar varias versión de Node según las necesidades del proyecto. Se aconseja consultar su documentación para una orientación y configuraciones avanzadas.

Usaremos Node en su versión [18.x](https://github.com/nvm-sh/nvm?tab=readme-ov-file#intro)
```
nvm install 18
nvm use 18
```

Procederemos a la instalación de dependencias del esquema
```
npm install
```

Considera que cuando se realice una instalación para ambientes de producción, instalar únicamente los paquetes de producción
```
npm install --omit=dev
```

Considerar que como parte de las configuraciones utilizamos [dotenv](https://www.npmjs.com/package/dotenv) para gestionar las variables de entorno, por lo cuál, debemos crear el archivo ```.env``` en la raíz del proyecto.
```
cp .env.example .env
```

Finalmente utilizas el comando para iniciar la API. Posterior a la inicialización tendremos a disposición la URL inicial.
```
curl http://localhost:3500/
```

Si adicionalmente, queremos asegurarnos que todo esté bien antes de iniciar nuestro entorno, podemos ejecutar el comando para realizar las pruebas donde tendremos un segundo test que comprueba la inicialización de la API.

## Comandos

-   Iniciar aplicación con Node

```
npm run start
```

-   Iniciar aplicación en modo desarollo no Nodemon

```
npm run dev
```

-   Formateo de archivos con Prettier

```
npm run format
```

-   Visualizar problemas de linter con Eslint

```
npm run linter
```

-   Pruebas de código

```
npm run test
```

# Documentación adicional

-   [Nodemon](https://github.com/remy/nodemon#nodemon)
-   [ESlint](https://eslint.org/)
-   [Prettier](https://prettier.io/)
-   [Editorconfig](https://editorconfig.org/)
-   [Supertest](https://github.com/ladjs/supertest#readme)
-   [Jest](https://jestjs.io/docs/getting-started)
