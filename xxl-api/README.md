# ObsidianXXL-API
###### v0.1.1 (BETA)
---
The ObsidianXXL-API *(XXL-API)* is a standalone layer for the ObsidianXXL *(XXL)* Dashboard Web-Application. The XXL-API acts as middleware between the running Obsidian Blockchain and the XXL, as well as a few other additional features. This layer is JavaScript-centric and utilizes the NodeJS environment and Express framework for running a server with accessible routes.

## Prerequisites
### :// Git
Git is a source control management tool for organizing projects and files. Git should already be available on all major systems, but if it isn't please refer to the [Git Download Page](https://git-scm.com/downloads) to ensure it is installed.

### :// NodeJS + NPM
The NodeJS environment is available on all major Operating Systems. MacOS and Windows support packaged installers via the [NodeJS Download Page](https://nodejs.org/en/download/). There are binary files available for linux as well. Generally, NodeJS should also install NPM as well.
#### nodejs.Ubuntu >= 16.04
If you are setting the XXL-API up on an Ubuntu OS you can use the instructions below to install NodeJS and the accompanying Node Project Manager *(NPM)*.

```
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Test out your installation by running `node -v`, if you see a warning such as:
```
/usr/bin/env: ‘node’: No such file or directory
```

You will need to sumlink `nodejs`:
```
ln -s /usr/bin/nodejs /usr/bin/node
```

### :// Postgres
PostgreSQL or Postgres, is the database management system the XXL-API utilizes to store historical or informative details on your machine. Postgres is available on all major systems.
#### pg.Windows
Please see the downloadable Postgres installer on the [Postgres Downloads Page](https://www.postgresql.org/download/windows/).
#### pg.Mac
To install Postgres on your Mac you can use either [Brew](https://brew.sh/) to install from source or MacOS [Postgres.app](http://postgresapp.com/). For ease of use it may be good to just use the Application.
#### pg.Ubuntu >= 16.04
###### Installing PostgreSQL on Ubuntu 16.04
Install PostgreSQL through the standard `apt-get` package manager:
```
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
```

### :// Obsidian Blockchain
Since the XXL and XXL-API utilize and display information related to your Obsidian Node and the network, the Obsidian Blockchain is a required piece that must be installed and running in the background. You can use the [Obsidian-QT Packaged Release](https://github.com/obsidianproject/Obsidian-Qt/releases) or the binary file `obsidiand` which you can create from the source. If you are setting up `obsidiand` from the source we have guides available on our [Github Wiki](https://github.com/obsidianproject/Obsidian-Qt/wiki):
- [Ubuntu Manual Setup via Wiki](https://github.com/obsidianproject/Obsidian-Qt/wiki/Setting-up-a-VPS-to-stake-your-Obsidian!-~@Pixxl)
    - Explains how to set up a Virtual Private Server *(VPS)* remotely
    - Setup `obsidiand` on Ubuntu 16.04 remotely
- [Raspberry-Pi Setup via Wiki](https://github.com/obsidianproject/Obsidian-Qt/wiki/Raspberry-Pi-Obsidiand-Setup)

## Installation
After NodeJS and Postgres are both available on your machine you should now be able to download the XXL-API server. The XXL-API server is bundled together with the XXL so downloading the XXL itself is all that is required.

The following installation procedures should be done within your command prompt interface for your system. For example, MacOS has the `Terminal` application. Please determine what yours is and use it. If you require help please reach out to the Obsidian Dev team.

### :// Download ObsidianXXL Project
```
git clone https://github.com/obsidianproject/ObsidianXXL.git
```

### :// Install Project Dependencies
Switch to the folder/project you have just downloaded and run the following commands with `npm`. These should install the necessary files to run properly:
```
cd ObsidianXXL
npm install -g sequelize
npm install -g sequelize-cli
npm install -g pg pg-hstore
npm install
```

## Setting Up
### :// Run Config Setup Script
The XXL-API includes various commands to simplify interactions. One of which is a `setup` command to initialize your XXL-API settings. At this time **Mac OS and Ubuntu** are the only confirmed supported environments to use this interactive script. If you would like for us to support your system please let the Obsidian Dev team know or submit a [Github Issue](https://github.com/Manbearpixel/ObsidianXXL/issues).

```
# go to the xxl-api folder within the downloaded project
cd ObsidianXXL/xxl-api

# run the config command
npm run setup
```
Once the setup starts please read the questions thoroughly. Some questions will have a default answer which should be greyed out and surrounded (with parenthesis). If you hit `Enter` it will default to that. You can run the setup script as many times as you want, such as if you forgot the password, or would like to change options. You can also edit the generated config file later manually.

#### setup.run.Manual Config Setup
If you are unable to use the above setup command or would just like to do things manually please continue below.

##### Setup Postgres
Depending on your system you should be able to run `psql` or `sudo -u postgres psql`. If neither of those commands work please let the Obsidian Dev team know and what Operating System you are on. You can also do a quick search for "entering postgres shell on <blah system>".

###### Create User/Role
```
# Example:
# CREATE ROLE <USERNAME> WITH LOGIN PASSWORD '<PASSWORD>';
CREATE ROLE odn_xxl WITH LOGIN PASSWORD 'secret123';
```

###### Create Database
```
# Example:
# CREATE DATABASE <DB_NAME> OWNER <USERNAME>;
CREATE DATABASE odn_beta OWNER odn_xxl;
```

###### Assign User/Role Permissions
```
ALTER ROLE odn_xxl WITH LOGIN;
GRANT ALL PRIVILEGES ON DATABASE odn_beta to odn_xxl;
```

##### Create the Production Config file
There is a sample production file: `ObsidianXXL/xxl-api/config/production-sample.json`. You can duplicate that file and rename it to `production.json`. This file contains the information the XXL-API will use to authenticate requests. Please make sure the information in this file matches the information you have entered above when creating a user/role and database.

##### Run Migrations
Finally, you will need to run migrations. Migrations are essentially informative details about how the database should be configured.
```
NODE_ENV=production sequelize db:migrate
```

### :// Adjust Obsidian Configuration File
There should be an `obsidian.conf` file you can adjust after running the application for the first time. You will need to adjust the config file to ensure the XXL-API can communicate to your running blockchain node successfully. Since Obsidian is based on Bitcoin/Stratis, you can find the Obsidian folder in the same location as Bitcoin would be.
- On MacOS, this is found in `~/Library/Application\ Support/ObsidianQT/`.
- On Ubuntu/Linux, it should be found within `~/.obsidian/`.
- On Windows, it should be within `App Data` as a hidden folder.
- [Click here for help finding](https://bitzuma.com/posts/moving-the-bitcoin-core-data-directory/)

Please ensure the following information is added to the conf file and saved:
```
server=1
rpcuser=me
rpcpassword=123
rpcport=8332
```

## Running
Please ensure the following steps are done:
1. The Obsidian Blockchain is running in the background, either as a Wallet App or via the `obsidiand` process.
2. You have modified the `obsidian.conf` file with specific settings listed above.
  - *If you have modified your Obsidian Blockchain config file you must reset your application/process first!*

If you are only running the XXL-API for a **production/live environment** then there is nothing else you need to do here! Please continue on with the [XXL README](../README.md) *(which is a lot shorter!)*.

## Development
<< Section WIP >>

## Commands
The following are commands available for the XXL-API and must be run within the `xxl-api` folder.

### :// Setup
Runs through a setup prompt to configure XXL-API for production/live.
```
npm run setup
```

### :// Migrate
Migrates the database information and readies the database. **Required** to run after executing `cleanup` as cleanup will remove this information.
```
npm run migrate
```

### :// Cleanup
**Removes** information and migration details from your database. Good for starting over/fresh.
```
npm run cleanup
```

### :// Start
Runs a **development** version of XXL-API and is available locally on port 4201 by default. Do NOT run this unless you are developing! It is not for production! Please refer to the XXL README for running live!
```
npm run start
```
