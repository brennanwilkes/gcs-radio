# **GCS Radio**  

<div align="center">  

[![Live Deployment](https://img.shields.io/badge/Live-Deployment-223?style=for-the-badge&logo=google-cloud&logoColor=0bc) ](https://gcsradio.codexwilkes.com) [![pipeline status](https://img.shields.io/gitlab/pipeline/brennanwilkes/gcs-radio/master?color=223&label=Pipeline&logo=git&logoColor=0bc&style=for-the-badge) ](https://gitlab.com/brennanwilkes/gcs-radio/-/pipelines) ![Updated](https://img.shields.io/github/last-commit/brennanwilkes/gcs-radio?color=223&label=Updated&logo=git&logoColor=0bc&style=for-the-badge) ![Version](https://img.shields.io/github/package-json/v/brennanwilkes/gcs-radio?color=223&logo=git&logoColor=0bc&style=for-the-badge)  

[![coverage report](https://img.shields.io/gitlab/coverage/brennanwilkes/gcs-radio/master?color=223&logo=typescript&logoColor=0bc&style=for-the-badge)](https://brennanwilkes.gitlab.io/gcs-radio/) ![Code](https://img.shields.io/github/languages/code-size/brennanwilkes/gcs-radio?color=223&logo=typescript&logoColor=0bc&style=for-the-badge) ![Language](https://img.shields.io/github/languages/top/brennanwilkes/gcs-radio?color=223&logo=typescript&logoColor=0bc&style=for-the-badge) ![React](https://img.shields.io/github/package-json/dependency-version/brennanwilkes/gcs-radio/react?color=223&logo=react&logoColor=0bc&style=for-the-badge)  

[![author](https://img.shields.io/badge/author-Brennan%20Wilkes-223?style=for-the-badge&logo=gmail&logoColor=0bc) ](https://bw.codexwilkes.com/portfolio/)  
</div>  

Welcome to GCS Radio, a dynamic internet radio web-app. GCS Radio allows users to create and share custom music playlists, then converts them to dynamically generated internet radio stations! To try it out, check out the [Live Deployment](https://gcsradio.codexwilkes.com).  

GCS Radio is developed primarily in typescript. The frontend is built in React TSX, while the backend is ts-node. The two layers connect through a custom REST API, while data-storage and caching is done via mongoDB.  

GCS Radio is currently available in
 - 🇨🇦 English (en)
 - 🇩🇪 German (de)
 - 🇫🇷 French (fr)
 - 🇮🇹 Italian (it)
 - 🇯🇵 Japanese (ja)
 - 🇳🇴 Norwegian (no)
 - 🇧🇷 Portuguese (pt)
 - 🇸🇪 Swedish (sv)
 - 🇨🇳 Mandarin (zh)

If GCS Radio guesses your language wrong, add `?lang=code` with your language code to the URL.

---  

### Core Features

To start using [GCS Radio](https://gcsradio.codexwilkes.com), start by creating an [account](https://gcsradio.codexwilkes.com/login/?signup=1). While the site can be navigated, and anonymous playlists can be created without one, a Spotify-linked account is currently required in order to play the songs themselves. You may sign-up using an email (verification is required, check your spam folder!), Google account, or Spotify account, however linking Spotify is required in order to play music, so if you choose email or Google, you will need to further link your Spotify once you have logged in.  

Once logged in, head over to the [Browse](https://gcsradio.codexwilkes.com/browse/) page where you can view an assortment of playlists curated by other users. Each one has the option to be played, or "edited", which allows you to add a copy to your own profile, where you can make adjustments, and even re-share it with the community.  

Once you're ready to build your own playlist go to the [Build](https://gcsradio.codexwilkes.com/build) page. Here you can add songs either by textual search, or by Spotify ID or link. Spotify resources can be individual songs, full albums, artists, or even entire pre-made playlists. Once you've picked your songs, hit **Add Details** to add a title, description, privacy setting, and select up to three featured thumbnail songs! If you leave the title field blank, the playlist, while still listenable, will not be saved to your profile, and will not be visible on the browse page. Hit **Save** to save the playlist to your profile, and **Play** to start listening!  

Not sure what you want to listen to? No problem, hit the [Generator](https://gcsradio.codexwilkes.com/generate/) page, where you can select up to five "seed" songs to generate a playlist off of! If you know what types of music you want, activate and play around with the optional sliders below. These sliders represent fields from the [Spotify Recommendations API](https://developer.spotify.com/console/get-recommendations/). Additionally, if your account has spotify connected, over on your [Dashboard](https://gcsradio.codexwilkes.com/dashboard/) you will find a **Generate** button which will build you three custom playlists tuned specifically for your tastes.  

Once you start listening to a playlist, GCS Radio will play auto-generated radio host voice lines before and in-between songs! These voice lines will talk about the music, give local news, weather, and traffic updates, and sometimes show a little of their personalities! Want radio in a different language? No problem, the voice selector can request from 16 different personalities!  

---  

### Build and Deploy  

GCS Radio is completely open-source under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), and can be cloned, modified, built, and deployed for your own custom use. The only major dependency is [node](https://nodejs.org/en/)  

To build GCS Radio from source, run the following  
```sh
git clone https://gitlab.com/brennanwilkes/gcs-radio.git
cd gcs-radio
npm install
npm run build:frontend
npm run build:backend
```  

To configure GCS Radio, three steps are needed. Configuration, environment setup, and database setup.  

#### Configuration  

Configuration files can be found under the `/src/config/` or `/config/` (symbolic link)

##### Analytics  

| Key              |                                 Instructions                                 |
|------------------|:----------------------------------------------------------------------------:|
| googleTrackingId | Obtained from [Google Analytics](https://analytics.google.com/analytics/web) |

##### Email  

| Key         |                                                Instructions                                               |
|-------------|:----------------------------------------------------------------------------------------------------------|
| fromEmail   | Email address to send verification emails from in the form "First Last \<address\>"                         |
| emailApiKey | API key from [SendGrid](https://console.cloud.google.com/marketplace/details/sendgrid-app/sendgrid-email) |

##### Google  

| Key                         |                                              Instructions                                              |
|-----------------------------|:-------------------------------------------------------------------------------------------------------|
| auth_uri                    | Google Accounts oauth2 URI                                                                             |
| token_uri                   | Google APIs oauth2 token URI                                                                           |
| auth_provider_x509_cert_url | Google APIs oauth2 certificates URI                                                                    |
| scope                       | Google account scopes to request                                                                       |
| googleProjectId             | ID of Google Cloud Project to deploy to and use APIs from                                              |
| googleClientId              | From google cloud - Will take the form of "\******.apps.googleusercontent.com"                          |
| googleClientSecret          | Token secret from google cloud                                                                         |
| googleCredentialsFile       | Path to a local Google Cloud Application Credentials file                                              |
| youtubeCookie               | Optional YouTube cookie for higher query limits. Found under the Headers of any web request to YouTube |

##### Miscellaneous  

| Key                      |                                        Instructions                                       |
|--------------------------|:------------------------------------------------------------------------------------------|
| matchWithYoutube         | Boolean - Whether or not backend should match songs with a YouTube ID for future features |
| defaultAudioId           | Should be generated dynamically. See "Database Setup"                                     |
| port                     | Backend server port                                                                       |
| verbose                  | Provides additional backend output to console                                             |
| encryptionSecret         | Secret to encrypt passwords and user IDs with                                             |
| encryptionExpiryTime     | Expiry time for user logins                                                               |
| databaseConnectionString | MongoDB Connection string                                                                 |
| defaultApiLimit          | Default limit on GET endpoints, or for dynamic POST endpoints                             |

##### Spotify  

| Key                 | Instructions                                                                                      |
|---------------------|---------------------------------------------------------------------------------------------------|
| scope               | Spotify account scopes to request                                                                 |
| spotifyClientId     | Found on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)  |
| spotifyClientSecret | Found on the  [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) |

#### Environment Setup  

By default, sensitive configuration options pull from environment variables. This can of course be configured. To create an environment file, first copy the example file.  

```sh
cp .env.sample .env
```

Next, replace all sample/default values with real API keys, tokens, and secrets.  

If you wish to deploy the application via an automatic DevOps pipeline, these environment variables will need to be set under your CI/CD Settings.  

#### Database Setup  

GCS Radio requires some initial database values. Specifically, it requires a set of at minimum two voice line templates, and a default audio binary bucket. To generate these, run the following.  

```sh
npm run generateVoiceTemplates
npm run generateDefaultAudio
```

The second of the two, "generateDefaultAudio" will output a default audio ID to stdout. This ID will be automatically added to your .env file, but will need to be added manually to any CI/CD setup.  

#### Deployment  

Once the above steps have been completed, GCS Radio can be run in a number of ways. Most trivially, it can be directly from the command line with  

```sh
npm start
```

If you are actively developing a local copy, both backend and frontend auto-build scripts are available. For the frontend run  

```sh
npm run watch
```

and for the backend run  

```sh
npm run dev
```

GCS Radio is configured with a Dockerfile, and can be compiled into a Docker image to be deployed to a runner of your choice. A shortcut has been provided with  

```sh
npm run dockerize
```

Should you desire to deploy to Google Cloud Run specifically, a shortcut has been provided with  

```sh
npm run deploy
```

This script will deploy to a Google Cloud Run instance labelled "gcs-radio". Should you wish to provide a custom label, you can instead run  

```sh
bash ./src/dev/deploy.sh [LABEL]
```

---

### API Reference  

The GCS Radio API is publicly available on the live deployment for your own applications to use. Should you utilize it, [reach out](mailto:brennan@codexwilkes.com) and we can add your application to a featured section of this manual.  

All of the following endpoints are available as extensions to the base URL `https://gcsradio.codexwilkes.com/api`  

#### Version 1  

All of the following endpoints are available as extensions to the base endpoint `/v1`  

#### Songs  


**Get All or Multiple Songs**  

Permits a `limit` parameter to specify how many songs to retrieve.  
```js
GET /songs
GET /songs?limit={number}
```
```js
curl -X GET "/songs?limit=1"

{
   "songs":[
      {
         "title":"IRIS",
         "artist":"Ashes To Amber",
         "album":"Voodoo Blu",
         "duration":151578,
         "explicit":false,
         "spotifyId":"61jCFoNIuzQnc9UovuzNVW",
         "artistSpotifyId":"1VjLe0p8LUFKPbyKaQZAgu",
         "albumSpotifyId":"2u3r9jBnRD3KQhhHiT4zQq",
         "youtubeId":"DEFAULT",
         "tags":[],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b273dd6a81a419494225f7b98031",
         "releaseDate":"2018-10-01",
         "audioId":"60636fc786cf7d39cd108a87",
         "id":"6067f91f27e1ac000d5a39bb",
         "links":[
            {
               "rel":"Play Audio",
               "action":"GET",
               "href":"/api/audio/60636fc786cf7d39cd108a87",
               "types":[
                  "audio/mpeg"
               ]
            },
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/songs/6067f91f27e1ac000d5a39bb",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}
```

**Get a Specific Song**

```js
GET /songs/{id}
```

```js
curl -X GET "/songs/6067f92027e1ac000d5a39c1"

{
   "songs":[
      {
         "title":"Bad Decisions",
         "artist":"Two Door Cinema Club",
         "album":"Gameshow (Deluxe Edition)",
         "duration":297786,
         "explicit":false,
         "spotifyId":"16zhp2yvOK1TVnGwsuESJ9",
         "artistSpotifyId":"536BYVgOnRky0xjsPT96zl",
         "albumSpotifyId":"4cs2ljCqYFk7MJTb4YtEd7",
         "youtubeId":"DEFAULT",
         "tags":[],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b27371758232ed76566d30b86c5e",
         "releaseDate":"2016-10-14",
         "audioId":"60636fc786cf7d39cd108a87",
         "id":"6067f92027e1ac000d5a39c1",
         "links":[
            {
               "rel":"Play Audio",
               "action":"GET",
               "href":"/api/v1/audio/60636fc786cf7d39cd108a87",
               "types":[
                  "audio/mpeg"
               ]
            },
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/v1/songs/6067f92027e1ac000d5a39c1",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}

```

**Create a Song**

This is done by supplying a Spotify resource ID, and matching YouTube resource ID, or the YouTube ID `DEFAULT` if the application is not in matchWithYoutube mode.

```js
POST /songs?spotifyId={ID}&youtubeId={ID}
POST /songs?spotifyId={ID}&youtubeId=DEFAULT
```
```js
curl -X POST "songs?spotifyId=6m8mbyoMIs5Tg8HNfStrjQ&youtubeId=DEFAULT"

{
   "songs":[
      {
         "title":"Gone (The Pocahontas Song)",
         "artist":"Ziggy Alberts",
         "album":"Land & Sea",
         "duration":218500,
         "explicit":false,
         "spotifyId":"6m8mbyoMIs5Tg8HNfStrjQ",
         "artistSpotifyId":"6tuPdaFPIytg3l2f51L7Hw",
         "albumSpotifyId":"6Gh1pmtlyyqDkkhCftUvVy",
         "youtubeId":"DEFAULT",
         "tags":[

         ],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b273186328f966cf76cb0b06b1c5",
         "releaseDate":"2014-12-11",
         "audioId":"60636fc786cf7d39cd108a87",
         "id":"6067f95a27e1ac000d5a39ef",
         "links":[
            {
               "rel":"Play Audio",
               "action":"GET",
               "href":"/api/audio/60636fc786cf7d39cd108a87",
               "types":[
                  "audio/mpeg"
               ]
            },
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/songs/6067f95a27e1ac000d5a39ef",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}
```

**Create Songs by Playlist**  

Will create songs similar to the existing songs of a playlist. Primary use case is to allow playlists to be "infinite" by continuously requesting more similar songs. Permits a `limit` parameter to specify how many songs to create.

```js
POST /songs/next?playlist={id}
POST /songs/next?playlist={id}&limit={number}
```
```js
curl -X POST "/songs/next?playlist=6067f92427e1ac000d5a39d2&limit=1"

{
   "songs":[
      {
         "title":"The Bottom of It",
         "artist":"Fruit Bats",
         "album":"Gold Past Life",
         "duration":181400,
         "explicit":false,
         "spotifyId":"4zHd5GGgiH73PTU8vhrMZi",
         "artistSpotifyId":"6Qm9stX6XO1a4c7BXQDDgc",
         "albumSpotifyId":"4yyxKPCiD1A7kQkfidacBu",
         "youtubeId":"DEFAULT",
         "tags":[],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b2737ca56f0f68b08e7cab7fe4a8",
         "releaseDate":"2019-06-21",
         "audioId":"60636fc786cf7d39cd108a87",
         "id":"606e39c8a0fc71000d4a134b",
         "links":[
            {
               "rel":"Play Audio",
               "action":"GET",
               "href":"/api/v1/audio/60636fc786cf7d39cd108a87",
               "types":[
                  "audio/mpeg"
               ]
            },
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/v1/songs/606e39c8a0fc71000d4a134b",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}
```

#### Playlists  

**Get All or Multiple Playlists**  

 - Permits a `limit` parameter to specify how many songs to retrieve.  
 - Permits an `isNamed` parameter, where if set, only playlists with names will be returned.  
 - Permits an `noAutoGenerated` parameter, where if set, only playlists made by users will be returned.  

```js
GET /playlists
GET /playlists?limit={number}
GET /playlists?isNamed={anything}
GET /playlists?noAutoGenerated={anything}
```
```js
curl -X GET "/playlists?limit=1"

{
   "playlists":[
      {
         "songs":[
             {
                "title":"IRIS",
                "artist":"Ashes To Amber",
                "album":"Voodoo Blu",
                "duration":151578,
                "explicit":false,
                "spotifyId":"61jCFoNIuzQnc9UovuzNVW",
                "artistSpotifyId":"1VjLe0p8LUFKPbyKaQZAgu",
                "albumSpotifyId":"2u3r9jBnRD3KQhhHiT4zQq",
                "youtubeId":"DEFAULT",
                "tags":[

                ],
                "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b273dd6a81a419494225f7b98031",
                "releaseDate":"2018-10-01",
                "audioId":"60636fc786cf7d39cd108a87",
                "id":"6067f91f27e1ac000d5a39bb",
                "links":[
                   {
                      "rel":"Play Audio",
                      "action":"GET",
                      "href":"/api/audio/60636fc786cf7d39cd108a87",
                      "types":[
                         "audio/mpeg"
                      ]
                   },
                   {
                      "rel":"self",
                      "action":"GET",
                      "href":"/api/songs/6067f91f27e1ac000d5a39bb",
                      "types":[
                         "application/json"
                      ]
                   }
                ]
             }, ...
         ],
         "id":"6067f92427e1ac000d5a39d2",
         "details":{
            "user":"6067f89627e1ac000d5a39ba",
            "name":"Retro Inspired",
            "description":"Contemporary tunes with a retro vibe",
            "features":[
               {
                  "title":"Candy Wrappers",
                  "artist":"Summer Salt",
                  "album":"So Polite",
                  "duration":194418,
                  "explicit":false,
                  "spotifyId":"2WrzwxqDxBWcWYkk9DAJ9j",
                  "artistSpotifyId":"3MATPJ9tYbcMhw5VOZrRU6",
                  "albumSpotifyId":"3cRKFC6SpDSieD1UXfV6Fv",
                  "youtubeId":"DEFAULT",
                  "tags":[

                  ],
                  "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b27372dda75d6fb0b8d524476595",
                  "releaseDate":"2017-07-18",
                  "audioId":"60636fc786cf7d39cd108a87",
                  "id":"6067f92027e1ac000d5a39c0",
                  "links":[
                     {
                        "rel":"Play Audio",
                        "action":"GET",
                        "href":"/api/audio/60636fc786cf7d39cd108a87",
                        "types":[
                           "audio/mpeg"
                        ]
                     },
                     {
                        "rel":"self",
                        "action":"GET",
                        "href":"/api/songs/6067f92027e1ac000d5a39c0",
                        "types":[
                           "application/json"
                        ]
                     }
                  ]
              }, ...
            ],
            "autoGenerated":false
         },
         "private":false,
         "links":[
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/playlists/6067f92427e1ac000d5a39d2",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}
```

**Get a Specific Playlist**  

```js
GET /playlists/{id}
```

```js
curl -X GET "/playlists/6067f9e327e1ac000d5a3a3a"

{
   "playlists":[
      {
         "songs":[
             {
                "title":"Changing of the Seasons",
                "artist":"Two Door Cinema Club",
                "album":"Changing Of The Seasons",
                "duration":222880,
                "explicit":false,
                "spotifyId":"6SlZp9UeLRIuw92j96dcjU",
                "artistSpotifyId":"536BYVgOnRky0xjsPT96zl",
                "albumSpotifyId":"5ClKeDzSpUxrpTKWFwixQ7",
                "youtubeId":"DEFAULT",
                "tags":[

                ],
                "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b273571269d36f8936b86937b7f4",
                "releaseDate":"2013-09-27",
                "audioId":"60636fc786cf7d39cd108a87",
                "id":"6067f9d427e1ac000d5a39fa",
                "links":[
                   {
                      "rel":"Play Audio",
                      "action":"GET",
                      "href":"/api/audio/60636fc786cf7d39cd108a87",
                      "types":[
                         "audio/mpeg"
                      ]
                   },
                   {
                      "rel":"self",
                      "action":"GET",
                      "href":"/api/songs/6067f9d427e1ac000d5a39fa",
                      "types":[
                         "application/json"
                      ]
                   }
                ]
            }, ...
        ],
         "id":"6067f9e327e1ac000d5a3a3a",
         "details":{
            "user":"6067f99927e1ac000d5a39f9",
            "name":"Good Vibes",
            "description":"Happy up-beat tunes for the afternoon",
            "features":[
               {
                  "title":"Burn Fast (Louis Vivet Remix)",
                  "artist":"Bryce Fox",
                  "album":"Burn Fast (Louis Vivet Remix)",
                  "duration":236066,
                  "explicit":false,
                  "spotifyId":"3kCsMI1T5iW0xlq6LMXN5B",
                  "artistSpotifyId":"6g878dtAhjegRHVe5X0ALf",
                  "albumSpotifyId":"2tn23c7BPHZN1Got1ZUPa7",
                  "youtubeId":"DEFAULT",
                  "tags":[

                  ],
                  "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b27334d8fb7c189603dd60e47197",
                  "releaseDate":"2016-03-08",
                  "audioId":"60636fc786cf7d39cd108a87",
                  "id":"6067f9d427e1ac000d5a39fe",
                  "links":[
                     {
                        "rel":"Play Audio",
                        "action":"GET",
                        "href":"/api/audio/60636fc786cf7d39cd108a87",
                        "types":[
                           "audio/mpeg"
                        ]
                     },
                     {
                        "rel":"self",
                        "action":"GET",
                        "href":"/api/songs/6067f9d427e1ac000d5a39fe",
                        "types":[
                           "application/json"
                        ]
                     }
                  ]
              }, ...
            ]
         },
         "private":false,
         "links":[
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/playlists/6067f9e327e1ac000d5a3a3a",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}```

**Create a Playlist**  

Post body must contain a songs and features array of at least one song ID. Features array may have a maximum of 3 song IDs.

Additionally, an associated user ID and playlist name may be provided. If both are provided, then an optional privacy and description may also be provided.

User ID must match the encrypted user ID provided in either the `token` header, or `jwt` cookie.

```js
POST /playlists
    songs: [ {id}, {id}... ]
    features: [ {id}, {id}... ]

    user: {id}
    name: {string}

    description: {string}
    private: {boolean}
```

```js
curl -X POST "/api/v1/playlists" \
--data-raw '{
    "songs": [
        "6068139bea7d8b000de1287b",
        "606a969f4b690393557778d7",
        "60688be8a7405a000de42da3",
        "606f7efcb2cb4c000db4f631"
    ],
    "user":"6067f99927e1ac301d5b18e9",
    "name": "My Awesome Playlist",
    "description": "It is super awesome",
    "features": [
        "6068139bea7d8b000de1287b",
        "606a969f4b690393557778d7",
        "60688be8a7405a000de42da3"
    ],
    "private": true
}'

{
    "playlists": [
        {
            "songs": [
                ...
            ],
            "id": "606f7f73cea392000dc0e12a",
            "details": {
                "user":"6067f99927e1ac301d5b18e9",
                "name": "My Awesome Playlist",
                "description": "It is super awesome",
                "features": [
                    "6068139bea7d8b000de1287b",
                    "606a969f4b690393557778d7",
                    "60688be8a7405a000de42da3"
                ]
            },
            "private": true,
            "links": [
                {
                    "rel": "self",
                    "action": "GET",
                    "href": "/api/v1/playlists/606f7f73cea392000dc0e12a",
                    "types": [
                        "application/json"
                    ]
                }
            ]
        }
    ]
}
```

**Create Generated Playlist**  

Post body must contain a songs array of between 1 and 5 song IDs.

Additional parameters may optionally be provided which will be passed on as "target" parameters to the [Spotify Recommendations API](https://developer.spotify.com/console/get-recommendations/).


```js
POST /playlists/generate
    songs: [ {id}, {id}... ]
    acousticness: {0.0-1.0}  
    danceability: {0.0-1.0}  
    energy: {0.0-1.0}  
    instrumentalness: {0.0-1.0}  
    key: {0-11}  
    loudness: {-100.0-100.0}  
    tempo: {0-200}  
    valence: {0.0-1.0}  
    mode: {boolean}  
```

```js
curl -X POST "/playlists/generate" \
--data-raw '{
   "private":false,
   "songs":[
      "606f8425b2cb4c000db4f652",
      "606f8425b2cb4c000db4f651",
      "606f8425b2cb4c000db4f653"
   ],
   "energy":0.73,
   "loudness":-30,
   "tempo":126,
   "valence":0.75
}'

{
   "playlists":[
      {
         "songs":[
            ...
         ],
         "id":"606f8426b2cb4c000db4f672",
         "private":false,
         "links":[
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/playlists/606f8426b2cb4c000db4f672",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}
```

**Create Made for You Playlist**  

Will return three distinct playlists based off of the user's favourite Spotify artists. Playlist 1 will use artists from the previous 4 weeks, Playlist 2 the previous 6 months, and Playlist 3 all time.

Request must include a `Token` header or `jwt` cookie which authenticates to an account with Spotify connected.

A `limit` parameter may be included which specifies the number of songs to add to the playlists.

```js
POST /playlists/made-for-me
POST /playlists/made-for-me?limit={number}
```

```js
curl -X POST "/playlists/made-for-me?limit=30"

{
   "playlists":[
      {
         "songs":[ ... ],
         "id":"606f85e0b2cb4c000db4f715",
         "details":{
            "user":"6067f99927e1ac301d5b18e9",
            "name":"On The Go",
            "description":"Briston Maroney, Elliot Root, Christian French",
            "features":[
               "606f85e0b2cb4c000db4f6bb",
               "606f85e0b2cb4c000db4f6bc",
               "606f85e0b2cb4c000db4f6bd"
            ],
            "autoGenerated":true
         },
         "private":true,
         "links":[
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/v1/playlists/606f85e0b2cb4c000db4f715",
               "types":[
                  "application/json"
               ]
            }
         ]
      },
      {
         "songs":[ ... ],
         "id":"606f85e0b2cb4c000db4f716",
         "details":{
            "user":"6067f99927e1ac301d5b18e9",
            "name":"Recent Favourites",
            "description":"Louis The Child, Seafret, Quinn XCII",
            "features":[
               "606f85e0b2cb4c000db4f6d9",
               "606f85e0b2cb4c000db4f6da",
               "606f85e0b2cb4c000db4f6db"
            ],
            "autoGenerated":true
         },
         "private":true,
         "links":[
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/v1/playlists/606f85e0b2cb4c000db4f716",
               "types":[
                  "application/json"
               ]
            }
         ]
      },
      {
         "songs":[ ... ],
         "id":"606f85e0b2cb4c000db4f717",
         "details":{
            "user":"6067f99927e1ac301d5b18e9",
            "name":"Old Memories",
            "description":"Marshmello, The Band CAMINO, Avicii",
            "features":[
               "606f85e0b2cb4c000db4f6f7",
               "606f85e0b2cb4c000db4f6f8",
               "606f85e0b2cb4c000db4f6f9"
            ],
            "autoGenerated":true
         },
         "private":true,
         "links":[
            {
               "rel":"self",
               "action":"GET",
               "href":"/api/v1/playlists/606f85e0b2cb4c000db4f717",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}
```

**Edit Playlist**  

Playlists may be edited by supplying a request similar to the aforementioned `POST /playlists` endpoint. All parameters are optional, and the corresponding resource will be updated.

Request must include a `Token` header or `jwt` cookie which authenticates to the same account which "owns" the playlist.


```js
PATCH /playlists/{id}
    songs: [ {id}, {id}... ]
    features: [ {id}, {id}... ]
    name: {string}
    description: {string}
    private: {boolean}
```

```js
curl -X POST "/api/v1/playlists/606f7f73cea392000dc0e12a" \
--data-raw '{
   "name":"My Awesome Playlist with edits!",
}'

{
    "playlists": [
        {
            "songs": [
                ...
            ],
            "id": "606f7f73cea392000dc0e12a",
            "details": {
                "user":"6067f99927e1ac301d5b18e9",
                "name": "My Awesome Playlist with edits!",
                "description": "It is super awesome",
                "features": [
                    "6068139bea7d8b000de1287b",
                    "606a969f4b690393557778d7",
                    "60688be8a7405a000de42da3"
                ]
            },
            "private": true,
            "links": [
                {
                    "rel": "self",
                    "action": "GET",
                    "href": "/api/v1/playlists/606f7f73cea392000dc0e12a",
                    "types": [
                        "application/json"
                    ]
                }
            ]
        }
    ]
}
```

**Delete a Playlist**  

Request must include a `Token` header or `jwt` cookie which authenticates to the same account which "owns" the playlist.

```js
DELETE /playlists/{id}
```

```js
curl -X DELETE /playlists/606f7f14cea392000dc0e129

{}
```

#### Voice Lines  

**Create a Voice Line**  

Voice lines are generated by providing either a `firstId` parameter, or `prevId` and `nextId` parameters, with values set to song IDs. The voice line will be generated either as an intro to `firstId` or as a audio transition between `prevId` and `nextId`.

Additionally the following optional parameters may be provided:
 - `playlist` parameter with the ID of the playlist being played
 - `voice` parameter specifying a specific voice to use. Options are:
  -  en-US-Wavenet-B
  -  en-US-Wavenet-D
  -  en-IN-Wavenet-C
  -  en-AU-Wavenet-B
  -  en-AU-Wavenet-C
  -  en-GB-Wavenet-F
  -  en-GB-Wavenet-B
  -  en-GB-Wavenet-D
  -  de-DE-Wavenet-B
  -  fr-FR-Wavenet-A
  -  it-IT-Wavenet-D
  -  ja-JP-Wavenet-D
  -  nb-NO-Wavenet-C
  -  pt-PT-Wavenet-B
  -  sv-SE-Wavenet-A
  -  cmn-CN-Wavenet-A

```js
POST /voiceLines?firstId={id}
POST /voiceLines?prevId={id}&nextId={id}
POST /voiceLines?prevId={id}&nextId={id}&voice={voice}
POST /voiceLines?prevId={id}&nextId={id}&playlist={id}
```

```js
curl -X POST "/voiceLines?nextId=6067f92027e1ac000d5a39c1&prevId=6067f92127e1ac000d5a39c5&voice=en-AU-Wavenet-B"

{
    "voiceLines": [
        {
            "id":"606f8c8e02c1fd000d1d2120",
            "text": "you've heard this song before, probably on the radio. bad decisions coming your way!",
            "type": "NORMAL",
            "audioId": "606f8c8e02c1fd000d1d211e",
            "voice": "en-AU-Wavenet-B",
            "gender": 0,
            "links": [
                {
                    "rel": "Play Audio",
                    "action": "GET",
                    "href": "/api/v1/audio/606f8c8e02c1fd000d1d211e",
                    "types": [
                        "audio/mpeg"
                    ]
                },
                {
                    "rel": "self",
                    "action": "GET",
                    "href": "/api/v1/voiceLines/606f8c8e02c1fd000d1d2120",
                    "types": [
                        "application/json"
                    ]
                }
            ]
        }
    ]
}
```

**Get a Voice Line**

```js
GET /voiceLines/{id}
```

```js
curl -X GET "/voiceLines/606f8c8e02c1fd000d1d2120"

{
    "voiceLines": [
        {
            "id":"606f8c8e02c1fd000d1d2120",
            "text": "you've heard this song before, probably on the radio. bad decisions coming your way!",
            "type": "NORMAL",
            "audioId": "606f8c8e02c1fd000d1d211e",
            "voice": "en-AU-Wavenet-B",
            "gender": 0,
            "links": [
                {
                    "rel": "Play Audio",
                    "action": "GET",
                    "href": "/api/v1/audio/606f8c8e02c1fd000d1d211e",
                    "types": [
                        "audio/mpeg"
                    ]
                },
                {
                    "rel": "self",
                    "action": "GET",
                    "href": "/api/v1/voiceLines/606f8c8e02c1fd000d1d2120",
                    "types": [
                        "application/json"
                    ]
                }
            ]
        }
    ]
}
```

#### Audio

**Get Audio**

The audio endpoint will return a `content-type: audio/mpeg` resource, not a JSON.

```js
GET /audio/{id}
```

```js
curl -X "/audio/60636fc786cf7d39cd108a87"

Binary MPEG data
```

#### Search

Queries Spotify for textual, or ID-based resources, and responds with Song object data, excluding an ID as no Song has been created. Depending on backend settings, the returned Songs *may* have been matched with a corresponding YouTube resource.

Either a textual search query, or Spotify resource must be provided. Spotify resources may be in the form of an ID, resource URI, or HTTP URL.

```js
GET /search?query={text}
GET /search?spotifyId={id}
GET /search?spotifyId={URL}
GET /search?spotifyId={URI}
```

```js
curl -X GET "/search?query=Take%20Five%20Dave%20Brubeck"

{
   "songs":[
      {
         "title":"Take Five",
         "artist":"Dave Brubeck",
         "album":"On Time",
         "duration":323066,
         "explicit":false,
         "spotifyId":"5p6me2mwQrGfH30eExHn6v",
         "artistSpotifyId":"3kUKwTJdH8FuWzF8p6Dg9E",
         "albumSpotifyId":"5LiPzuR79DTTmyROUm2luC",
         "youtubeId":"DEFAULT",
         "tags":[

         ],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b273c0f74b53d4cf4b14f7f5d41a",
         "releaseDate":"2001-04-02",
         "links":[
            {
               "rel":"Download",
               "action":"POST",
               "href":"/api/songs?youtubeId=DEFAULT&spotifyId=5p6me2mwQrGfH30eExHn6v",
               "types":[
                  "application/json"
               ]
            }
         ]
      },
      {
         "title":"Take Five",
         "artist":"The Dave Brubeck Quartet",
         "album":"Time Out",
         "duration":324133,
         "explicit":false,
         "spotifyId":"1YQWosTIljIvxAgHWTp7KP",
         "artistSpotifyId":"4iRZAbYvBqnxrbs6K25aJ7",
         "albumSpotifyId":"0nTTEAhCZsbbeplyDMIFuA",
         "youtubeId":"DEFAULT",
         "tags":[

         ],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
         "releaseDate":"1959-12-14",
         "links":[
            {
               "rel":"Download",
               "action":"POST",
               "href":"/api/songs?youtubeId=DEFAULT&spotifyId=1YQWosTIljIvxAgHWTp7KP",
               "types":[
                  "application/json"
               ]
            }
         ]
      },
      {
         "title":"Qualifiers",
         "artist":"Open Mike Eagle",
         "album":"Dark Comedy",
         "duration":211409,
         "explicit":true,
         "spotifyId":"08u83xFnbotiLYfptooHGt",
         "artistSpotifyId":"5CuU6SRJjbbZL926nSGGxX",
         "albumSpotifyId":"3hSppPElM044DnIafFTg96",
         "youtubeId":"DEFAULT",
         "tags":[

         ],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b273068a9d4ccbf5edbdecadd709",
         "releaseDate":"2014-06-10",
         "links":[
            {
               "rel":"Download",
               "action":"POST",
               "href":"/api/songs?youtubeId=DEFAULT&spotifyId=08u83xFnbotiLYfptooHGt",
               "types":[
                  "application/json"
               ]
            }
         ]
      },
      {
         "title":"Take Five",
         "artist":"Dave Brubeck",
         "album":"Dave Brubeck's Greatest Hits",
         "duration":324160,
         "explicit":false,
         "spotifyId":"5UbLKRX1qVROlwDFOooEvG",
         "artistSpotifyId":"3kUKwTJdH8FuWzF8p6Dg9E",
         "albumSpotifyId":"425dVE44lkA2a0FBI7MGLE",
         "youtubeId":"DEFAULT",
         "tags":[

         ],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b2736ca90aff3927a8b212258770",
         "releaseDate":"1966",
         "links":[
            {
               "rel":"Download",
               "action":"POST",
               "href":"/api/songs?youtubeId=DEFAULT&spotifyId=5UbLKRX1qVROlwDFOooEvG",
               "types":[
                  "application/json"
               ]
            }
         ]
      },
      {
         "title":"Take Five",
         "artist":"Dave Brubeck",
         "album":"I Like Jazz: The Essence Of Dave Brubeck",
         "duration":324173,
         "explicit":false,
         "spotifyId":"63H27dCDIap9kwalfQYe8B",
         "artistSpotifyId":"3kUKwTJdH8FuWzF8p6Dg9E",
         "albumSpotifyId":"4kgsqZhNOPOPwg4T5KKqVe",
         "youtubeId":"DEFAULT",
         "tags":[

         ],
         "thumbnailUrl":"https://i.scdn.co/image/ab67616d0000b2737a3bef7f31457ad46575c416",
         "releaseDate":"1991-10-04",
         "links":[
            {
               "rel":"Download",
               "action":"POST",
               "href":"/api/songs?youtubeId=DEFAULT&spotifyId=63H27dCDIap9kwalfQYe8B",
               "types":[
                  "application/json"
               ]
            }
         ]
      }
   ]
}
```

#### Errors

Should a REST request provide invalid data, missform a request, or fail for any reasons, the following Error structure will be returned.

```js
{
   "errors":[
      {
         "error": {Error Type},
         "path": {Request Path},
         "message": {Descriptive Message},
         "status": {Error Code},
         "timestamp": {Timestamp}
      }
   ]
}
```

---

### The Future

GCS Radio has an exciting future, and I welcome any and all comments, criticism, and support! Feel free to leave an [Issue](https://gitlab.com/brennanwilkes/gcs-radio/-/issues) if you find a bug (there are likely many), or submit a [Pull Request](https://gitlab.com/brennanwilkes/gcs-radio/-/merge_requests) if you want to collaborate!  

In terms of specific features, GCS Radio has a major usability choke-point in it's requirement for users to authenticate with Spotify in order to actually play music on the frontend. This needs to be expanded to allow multiple music playing methods. Both the frontend and backend have sufficient levels of abstractions that this should be not only possible, but relatively easy, but these alternate methods need to be found and implemented. Possible services could include YouTube Premium (YouTube IDs *can* already be matched with songs), SoundCloud, Apple Music, or Tidal.  

API endpoints need to be updated to support pagination as both the browse and dashboard pages will not scale with mass adoption.  

Further localization and documentation is always welcomed, specifically in the form of JSDocs comments.

Additional login methods such as GitHub and GitLab would be a neat feature to appease fellow developers.  

All in all, GCS Radio has a very exciting future, so make sure to leave a star on the [GitLab](https://gitlab.com/brennanwilkes/gcs-radio) page, and check in soon!
