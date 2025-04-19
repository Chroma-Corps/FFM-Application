# FFM Application
*Powered by **ChromaCorps***

<p align="center">
  <img src="https://img.shields.io/badge/Flask-Backend-blue.svg?style=for-the-badge&logo=flask" alt="Flask Backend" />
  <img src="https://img.shields.io/badge/React_Native-Mobile_App-61DAFB.svg?style=for-the-badge&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo_Go-Mobile_Launcher-000020.svg?style=for-the-badge&logo=expo" alt="Expo Go" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>


## Table of Contents
- [Project Overview](#project-overview)
- [Technologies](#technologies)
- [Installation Instructions](#installation-instructions)
- [Running the Application](#running-the-application)
  - [Setting Up and Running Flask](#1-setting-up-and-running-flask)
  - [Starting the React Native Frontend](#2-starting-the-react-native-frontend)
- [Deployment](#deployment)
- [Testing](#testing)

## Project Overview

FFM (Family Financial Management) Application is a **full-stack application** built with a **Flask Backend** following the FlaskMVC pattern and **React Native Frontend**. This app aims to provide users with a seamless way to track and manage their financial transactions, budgets and goals.

## Technologies

- **Backend**: Python 3, Flask
- **Frontend**: React Native
- **Database**: PostgreSQL
- **Backend Deployment**: Render
- **Frontend Deployment**: Expo

## Installation Instructions

To get started with this project locally, follow these steps to install the required dependencies.

### 1. Clone the Repository
Clone the repository to your local machine:

```bash
$ git clone https://github.com/Chroma-Corps/FFM-Application.git
$ cd FFM-Application
```

### 2. Installing Backend Dependencies
Make sure you have Python 3 and pip installed. Then, install the Python dependencies:

```bash
$ pip install -r requirements.txt
```

### 3. Installing Frontend Dependencies
Ensure you have Node.js installed. Install Expo CLI globally if you haven't already:

```bash
$ npm install -g expo-cli
```

Navigate to the React folder and install the necessary dependencies:
```bash
$ cd React
$ npm install
```

## Running the Application

### Setting Up and Running Flask
Start by setting up the backend. First, initialize the Flask application with the following command:

``` bash
$ flask init
```

This will set up the necessary configurations, such as database migrations.
Next, start the Flask development server:
```bash
$ flask run
```
The Flask backend will now be running locally.

### Starting the React Native Frontend
Once the Flask backend is running, open another terminal and navigate to the React folder:
```bash
$ cd React
```

Now, launch the React Native development server with:
```bash
$ npx expo start
```

Open in browser or scan the QR Code using [📲 Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en)


## Deployment
You can easily deploy the project to  **Gitpod** or **Render**:

<p align="center">
  <a href="https://gitpod.io/#https://github.com/Chroma-Corps/FFM-Application">
    <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" />
  </a>
  <a href="https://render.com/deploy?repo=https://github.com/Chroma-Corps/FFM-Application">
    <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" />
  </a>
</p>

To view the app on your mobile device:
- **STEP 01: Install the Expo Go application**
[📲 Expo Go - Apps on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en)
Or search for "Expo Go" in the App Store or Google Play.

- **STEP 02: Scan the QR Code using Expo Go**
Once the Metro bundler is running (from npx expo start), scan the displayed QR code with Expo Go to instantly preview the app on your device.

- **Here Is Our Deployed Version**

![QR Code](images/qrcode.png)

## Testing
![Tests](https://github.com/Chroma-Corps/FFM-Application/actions/workflows/dev.yml/badge.svg)

### Unit & Integration Testing
You can then execute all unit tests as follows
```bash
$ flask test all unit
```

You can then execute all user tests as follows
```bash
$ flask test user
```

💡 You can also supply "unit" or "int" at the end of the command to execute only **unit** or **integration** tests.

You can also run all application tests with the following command
```bash
$ pytest
```
![tests](<images/passingtests.png>)