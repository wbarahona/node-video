# node-video

Some api for youtube videos.

You need to run these commands:

1 - First install all dependencies for this project:

``npm install``

2 - Then inside ``./app/config/credentials`` create a JSON file as ``emailCredentials.json``
with the following structure, change it as required:
```javascript
{
  "clients": {
    "gmail": {
      "username": "your@gmail.com",
      "password": "yoursecretpassword",
      "name": "gmail",
      "port": 465,
      "secure": true,
      "host": "smtp.google.com"
    }
  }
}
```
Yes, gmail because we using a youtube service.

3 - Then

``npm start``

4 - In a second terminal tab start locally the front end app run

``gulp``

Et voila, you got yourself a restful api that will process videos users upload or from youtube url then will chop into 30s pieces each clip, so the user can later download one by one and upload those clippings into their social media of choice.