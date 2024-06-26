function validateCredentials(credentials) {
  const certificate = credentials.certificates[0];

  if (credentials.key.fingerprint() !== certificate.key().fingerprint()) {
    throw new Error('certificate and key do not match');
  }

  const validity = certificate.validity();
  if (validity.notAfter.getTime() < Date.now()) {
    throw new Error('certificate has expired: ' + validity.notAfter.toJSON());
  }

  if (credentials.production !== undefined) {
    const environment = certificate.environment();
    if (
      (credentials.production && !environment.production) ||
      (!credentials.production && !environment.sandbox)
    ) {
      throw new Error(
        'certificate does not support configured environment, production: ' + credentials.production
      );
    }
  }
}

module.exports = validateCredentials;
