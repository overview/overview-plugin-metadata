overview-plugin-metadata
========================

Edit metadata in a view.

Development
-----------

1. Start the development environment
    1. Install [NodeJS](https://nodejs.org/en/) v8+
    1. Start a development server: `generator/dev.js`. That'll start a server at [http://localhost:3000](http://localhost:3000).
    1. Run [Overview](https://github.com/overview/overview-server) in development mode
    1. Create a document set in Overview
    1. When viewing the document set, click `Add View` -> `Custom…` to create a new View. Enter `Metadata` as the name and `http://localhost:3000` as the URL.
1. Edit files in `assets/` and `views/`. Refresh in Overview to see the changes. (Alternatively, install [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) to make Overview refresh automatically when you edit files.)

Deployment on Amazon Web Services
---------------------------------

1. Initial deployment:
    1. Create an [S3](https://s3.console.aws.amazon.com/s3/home) bucket using a DNS name you own. (Ours is `overview-plugin-metadata.overviewdocs.com`.)
        * Use the default permissions, no more.
        * You may need to set CORS configuration on your bucket, by clicking `Permissions` and then `CORS configuration`. Search online to make sure the server will respond with `Access-Control-Allow-Origin: *`.
    1. Create a [CloudFront](https://console.aws.amazon.com/cloudfront/home) distribution using the S3 bucket. Make it HTTPS-only, and create a new certificate for it using Amazon ACM. (The CloudFront wizard prompts for its SSL certificate.)
    1. Create a [Route 53](https://console.aws.amazon.com/route53/home) record set for your DNS name, pointing it to your CloudFront distribution.
1. Every time you edit code:
    1. `git commit -a && git push`
    1. Ensure your AWS credentials are in your environment.
    1. Run `DEBUG='*' S3_BUCKET='s3://MY-BUCKET-NAME' ./generator/upload.js`
1. To test:
    1. `curl -v https://MY-BUCKET-NAME/metadata`. You should get a `200 OK` response.
    1. Add the plugin in Overview -- either from the `Add View` drop-down, or using `Add View` and then `Custom…` and choosing `https://MY-BUCKET-NAME` as a URL.

License
-------

This project is copyright (c) 2017 Overview Services Inc. It's released under the AGPL-3.0 open source license. See LICENSE for legal prose.
