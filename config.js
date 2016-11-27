
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5001,
  ip: process.env.IP || '0.0.0.0',
  root: __dirname, //path.normalize(),
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || '192.168.0.200',
      accessKey: process.env.MINIO_ACCESS_KEY || 'SN8JBGY43WPMFT0R56LG',
      secretKey: process.env.MINIO_SECRET_KEY || 'VkNiKgyMxXGUd7qQdMTs+3R9e/x4V0F6XpjtYFHt',
      region: 'us-east-1',
      secure: false,
      port: 8000,
  }
}