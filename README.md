# minio-nodejs-examples

Minio Example with Express.js


Download Minio Server
```sh
C:\Users\Manjesh\Downloads>minio --address :8000 server c:\Users\Manjesh\minio

AccessKey: TQKTLVI8HISTUPGGHJ7E  SecretKey: BttVU/Lz3qrXAHkXPw8X/3P9x3Ce3wJHxcQ0cKr4  Region: us-east-1

Minio Object Storage:
    http://192.168.56.1:8000
    http://192.168.0.218:8000
    http://127.0.0.1:8000

Minio Browser:
    http://192.168.56.1:8001
    http://192.168.0.218:8001
    http://127.0.0.1:8001

To configure Minio Client:
    Download "mc" from https://dl.minio.io/client/mc/release/windows-amd64/mc.exe
    $ mc.exe config host add myminio http://localhost:9000 TQKTLVI8HISTUPGGHJ7E BttVU/Lz3qrXAHkXPw8X/3P9x3Ce3wJHxcQ0cKr4
```


Clone from Github
```sh
git clone https://github.com/manjeshpv/minio-nodejs-example
cd minio-nodejs-example
npm install
node ./bin/www
```

Change Settings: `config.js`
```js
module.exports = {
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    accessKey: process.env.MINIO_ACCESS_KEY || 'TQKTLVI8HISTUPGGHJ7E',
    secretKey: process.env.MINIO_SECRET_KEY || 'BttVU/Lz3qrXAHkXPw8X/3P9x3Ce3wJHxcQ0cKr4',
    region: 'us-east-1',
    secure: false,
    port: 8000,
  }
}
```
