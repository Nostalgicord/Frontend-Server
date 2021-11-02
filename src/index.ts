import path from 'path';
import forge from 'node-forge';
import fs from 'fs';
import createCert from '@/createSsl';
import createServer from '@/createServer';

// TODO: check if it is local or remote to prevent issues
// create a ssl

try {
  fs.existsSync(path.join(__dirname, '..', 'ssl'));
  if (
    forge.pki.certificateFromPem(
      fs
        .readFileSync(path.join(__dirname, '..', 'ssl', 'caCert.pem'), 'utf8')
        .toString(),
    ).validity.notAfter.getTime > new Date().getTime
  ) {
    console.info('[SSL] The SSL certificate is expired, recreating...');
    fs.rmdirSync(path.join(__dirname, '..', 'ssl'));
    createCert(path.join(__dirname, '..', 'ssl'));
  }
} catch (err) {
  console.error(
    `[SSL] Either folder doesn't exist or SSL is corrupted. (${err})`,
  );
  if (fs.existsSync(path.join(__dirname, '..', 'ssl'))) {
    fs.rmdirSync(path.join(__dirname, '..', 'ssl'));
  }
  createCert(path.join(__dirname, '..', 'ssl'));
}

// create server

createServer(
  path.join(__dirname, '..', 'build'),
  path.join(__dirname, '..', 'ssl'),
);
