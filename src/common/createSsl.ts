import forge from 'node-forge';
import fs from 'fs';
import path from 'path';

export default function createCert(sslPath: string): void {
  try {
    fs.mkdirSync(sslPath);
    console.log('[Info] SSL folder Created.');
  } catch (err) {
    console.error(`[Error] SSL folder creation error: ${err}`);
  }

  let caAttrs = [
    {
      name: 'commonName',
      value: 'discordLocalCa',
    },
    {
      name: 'countryName',
      value: 'United Nations',
    },
    {
      shortName: 'ST',
      value: 'N/A',
    },
    {
      name: 'localityName',
      value: 'N/A',
    },
    {
      name: 'organizationName',
      value: 'localhost',
    },
    {
      shortName: 'OU',
      value: 'discordCa',
    },
  ];

  let attrs = [
    {
      name: 'commonName',
      value: 'discordLocal',
    },
    {
      name: 'countryName',
      value: 'United Nations',
    },
    {
      shortName: 'ST',
      value: 'N/A',
    },
    {
      name: 'localityName',
      value: 'N/A',
    },
    {
      name: 'organizationName',
      value: 'localhost',
    },
    {
      shortName: 'OU',
      value: 'discord',
    },
  ];

  let caKeys = forge.pki.rsa.generateKeyPair(2048);
  let caCert = forge.pki.createCertificate();

  caCert.publicKey = caKeys.publicKey;
  caCert.serialNumber = '01';
  caCert.validity.notBefore = new Date();
  caCert.validity.notAfter = new Date();
  caCert.validity.notAfter.setFullYear(
    caCert.validity.notBefore.getFullYear() + 1,
  );

  caCert.setSubject(caAttrs);
  caCert.setIssuer(caAttrs);
  caCert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true,
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 2,
          value: 'localhost',
        },
        {
          type: 7,
          ip: '127.0.0.1',
        },
      ],
    },
    {
      name: 'subjectKeyIdentifier',
    },
  ]);
  caCert.sign(caKeys.privateKey, forge.md.sha256.create());

  try {
    fs.writeFileSync(
      path.join(sslPath, 'caKey.key'),
      forge.pki.privateKeyToPem(caKeys.privateKey),
    );
  } catch (err) {
    console.log(`[Error]: CA Private key not saved: ${err}`);
  }

  try {
    fs.writeFileSync(
      path.join(sslPath, 'caCert.pem'),
      forge.pki.certificateToPem(caCert),
    );
  } catch (err) {
    console.log(`[Error]: CA not saved: ${err}`);
  }

  let cert = forge.pki.createCertificate();
  cert.publicKey = caCert.publicKey;
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  cert.setSubject(attrs);
  cert.setIssuer(caCert.subject.attributes);
  cert.setExtensions([
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 2,
          value: 'localhost',
        },
        {
          type: 7,
          ip: '127.0.0.1',
        },
      ],
    },
    {
      name: 'subjectKeyIdentifier',
    },
  ]);
  cert.sign(caKeys.privateKey, forge.md.sha256.create());

  try {
    fs.writeFileSync(
      path.join(sslPath, 'cert.pem'),
      forge.pki.certificateToPem(cert),
    );
  } catch (err) {
    console.log(`[Error]: Cert not saved: ${err}`);
  }
}
