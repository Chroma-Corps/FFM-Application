[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Chroma-Corps/FFM-Application)
<a href="https://render.com/deploy?repo=https://github.com/Chroma-Corps/FFM-Application">
  <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render">
</a>

<!-- ![Tests](https://github.com/Chroma-Corps/FFM-Application/actions/workflows/dev.yml/badge.svg) -->

# Dependencies
* Python3/pip3
* Packages Listed In Requirements.txt

# Installing Dependencies
```bash
$ pip install -r requirements.txt
```

# Running the Project

_For development run the serve command (what you execute):_
```bash
$ flask run
```

_For production using gunicorn (what the production server executes):_
```bash
$ gunicorn wsgi:app
```

# Deploying
You can deploy your version of this app to render by clicking on the "Deploy to Render" link above.

# Initializing the Database
When connecting the project to a fresh empty database ensure the appropriate configuration is set then file then run the following command. This must also be executed once when running the app on heroku by opening the heroku console, executing bash and running the command in the dyno.

```bash
$ flask init
```