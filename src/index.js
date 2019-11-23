const fs = require("fs");

const { paths } = require("../res/linux-cert-stores.json");
const splitPattern = /(?=-----BEGIN\sCERTIFICATE-----)/g;
const noCertsError = new Error(
  "No certificates were found. If you think this is a bug, please report it at https://github.com/kanishk98/linux-ca/issues"
);

const getAllCerts = (onData, onError, readSync = false) => {
  // TODO: Include https module certs here too
  const certs = [];
  if (readSync) {
    for (const path of paths) {
      try {
        const file = fs.readFileSync(path, "utf-8");
        certs.push(file.split(splitPattern).map(cert => cert));
        onData(certs);
        break;
      } catch (err) {
        onError(err);
      }
      // control reaches here only when all distro paths failed
      onError(noCertsError);
    }
  } else {
    for (const path of paths) {
      fs.readFile(path, "utf-8", (err, file) => {
        if (err) {
          onError(err);
        } else {
          if (!file) {
            return;
          }
          certs.push(file.split(splitPattern).map(cert => cert));
          onData(certs);
        }
      });
    }
  }
};

const getCert = (domain, onError) => {};

const streamAllCerts = (onData, onError) => {};

module.exports = { getAllCerts };
