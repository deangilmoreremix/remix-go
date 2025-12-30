### Remix Go

`master`: [ ![Codeship Status for strategic-limited/remix-go](https://app.codeship.com/projects/630d8d20-3b8b-0136-f448-5e3eb9768dd6/status?branch=master)](https://app.codeship.com/projects/290354)

`staging`: [ ![Codeship Status for strategic-limited/remix-go](https://app.codeship.com/projects/630d8d20-3b8b-0136-f448-5e3eb9768dd6/status?branch=staging)](https://app.codeship.com/projects/290354)

This is the part of the VidCloud project: lite editor of personalized videos.

## Technical Flow Diagram
![Technical Flow Diagram](https://cdn.vidcloud.io/resources/tech_flow.png)

## Features
 * Provide creating, editing and publishing of projects.
 
## Prerequisites
Before first launch the following software must be installed:
  * Node.js (18.x or higher).
 
## Installation
 1. `git clone git@github.com:strategic-limited/remix-go.git` - to get project sources;
 2. `npm install` - to install Node.js submodules.
 
## Environment variables
Variable|Affects on|Default value
--------|----------|-------------
PORT|Port that will be used to run this app|8888
MONGO_URL|Determines connection URL for MongoDB instance|'mongodb://localhost/makeapi'
USE_WHITE_LABELS|Determines if module will work supporting WhiteLabels|false
FALLBACK_DOMAIN|Domain that will be used if no WhiteLabel domain detected|'vidcloud.io'
FALLBACK_SERVICE_NAME|Display name of the service if no WhiteLabel detected|'VidCloud'
FALLBACK_SUPPORT_LINK|Default Support link|'http://digistrats.zendesk.com/'
DEFAULT_TUTORIALS_LINK|Default Tutorials link|'http://dashboard.vidcloud.io/tutorials'
FALLBACK_SALES_PAGE|Default Sales Page|''
APP_PREFIX|Default domain prefix for remix-editor module|'app'
API_PREFIX|Default domain prefix for remix-api module|'api'
EDITOR_PREFIX|Default domain prefix for remix-editor module|'app'
CDN_PREFIX|Default domain prefix for CDN used in this system|'cdn'
PROJECTS_PREFIX|Default domain prefix for remix-projects module|'projects'
APP_HOSTNAME|Path to this module|'https://app.vidcloud.io'
LOGIN_USERNAME|Client ID for basic auth on backend|'default'
LOGIN_PASSWORD|Client Secret for basic auth on backend|'default'
CDN_HOSTNAME|Base path to system CDN|'https://cdn.vidcloud.io'
OPTIMIZE_CSS|Determines if CSS converted from LESS should be optimized|false
COOKIE_DOMAIN|Cookie domain used for session|undefined
FORCE_SSL|Determines if we're using HTTPS|false
MAKE_ENDPOINT|Path to backend service|'https://api.vidcloud.io'
JWPLAYER_KEY|JWPlayer API Key|undefined
LOGIN_SERVER_URL|Legacy Login: Hostname for backend service|'http://localhost:3000'
LOGIN_SERVER_URL_WITH_AUTH|Legacy Login: Hostname for local service with credentials|'http://testuser:password@localhost:3000'
AUDIENCE|URL of projects module|'https://projects.vidcloud.io'
GA_ACCOUNT|Google Analytics account API Key|undefined
GA_DOMAIN|Domain for Google Analytics|undefined
SUPPORTED_LANGS|Languages provided by this module|'["*"]'
TOGETHERJS_ENABLED|Determines if TogetherJS should be enabled|false
TOGETHERJS|TogetherJS Endpoint|'https://togetherjs.com'
CLYP_ENDPOINT|Clyp Endpoint|'https://api.clyp.it'
S3_KEY|Key for AWS S3 instance used for this system|undefined
S3_BUCKET|AWS S3 Bucket for this system|undefined
S3_SECRET|Secret for AWS S3 instance used for this system|undefined
S3_DOMAIN|Domain for AWS S3 instance used for this system|undefined
S3_EMULATION|Determines if we're really working with AWS S3 or just simulating it for debug purposes|false
S3_PUBLISH_LIFETIME|Cache Control value for all published video|3600
SYNC_SOUNDCLOUD|Sync key for SoundCloud|undefined
SYNC_FLICKR|Sync key for Flickr|undefined
SYNC_GIPHY|Sync key for Giphy|undefined
SECRET|Legacy Login: Cookie Session secret|'dummy secret value'
KEEN_PROJECT_ID|Project ID for Keen.IO|undefined
KEEN_WRITE_KEY|Write Key for Keen.IO|undefined
NEW_RELIC_ENABLED|Determines if New Relic is enabled in app|false
NEW_RELIC_LICENSE_KEY|API Key for New Relic|undefined
BACKEND_URL|URL to remix-api instance working with this app|'http://localhost:1340'
BACKEND_CLIENT_ID|Client ID for basic auth on backend|'default'
BACKEND_CLIENT_SECRET|Client Secret for basic auth on backend|'default'
STYLE_REFRESH_STEP|Interval between two serial WhiteLabel CSS updating (ms)|5 * 60 * 1000


## Local Launch
Since VidCloud system supports WhiteLabels, it is important to simulate WhiteLabel behaviour for local machine.
It may be achieved with HTTP-proxy forwarding via nginx or Apache. For example, proxying setting for Remix Go and Apache will be the following:
    
    <VirtualHost *:80>
      ServerName vidcloud.io
      ServerAlias go.vidcloud.io
      ProxyPreserveHost On
      ProxyPass / http://127.0.0.1:1342/
      ProxyPassReverse / http://127.0.0.1:1342/
    </VirtualHost>

And `/etc/hosts` also should redirect this endpoint to loopback:
`127.0.0.1 go.vidcloud.io`
