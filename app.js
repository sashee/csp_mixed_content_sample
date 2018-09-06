const https = require('https');
const http = require('http');
const pem = require('pem');
const express = require('express');

const httpApp = express();

const httpServer = http.createServer(httpApp).listen(80);

(async () => {
	const {key, cert} = await (async () => {
		return new Promise((res, rej) => {
			pem.createCertificate({days: 1, selfSigned: true}, function (err, keys) {
				if (err) {
					rej();
				}else {
					res({key: keys.serviceKey, cert: keys.certificate});
				}
			});
		});
	})();

	const httpsApp = express()

	const httpsServer = https.createServer({key, cert}, httpsApp).listen(443)

	const initApp = (app) => {
		app.use((req, res, next) => {
			if (req.url === "/upgrade-requests.html") {
				res.append('Content-Security-Policy', 'upgrade-insecure-requests');
				res.append('Content-Security-Policy-Report-Only', 'default-src https:; report-uri /report');
			} else if (req.url === "/block-mixed-content.html") {
				res.append('Content-Security-Policy', 'block-all-mixed-content');
			} else if (req.url === "/iframe-upgrade-requests.html") {
				res.append('Content-Security-Policy', 'block-all-mixed-content');
			} else {
			}
			next();
		});

		app.use("/", express.static("static"));
	}

	initApp(httpApp);
	initApp(httpsApp);
})();