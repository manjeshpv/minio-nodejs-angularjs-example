/**
 * Created by Manjesh on 26-11-2016.
 */

minio = {
  endPoint: '192.168.0.200',
  accessKey: 'SN8JBGY43WPMFT0R56LG',
  secretKey: 'VkNiKgyMxXGUd7qQdMTs+3R9e/x4V0F6XpjtYFHt',
  region: 'us-east-1',
  secure: false,
  port: 8000,
}
ssl = minio.secure ? 's' : '';
minioURL = 'http'+ ssl +'://' + minio.endPoint + ':' + minio.port;