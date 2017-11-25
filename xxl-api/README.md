# ObsidianNodeJSAPI
###### v0.0.4 (BETA)
---
This project is for the active development of an API layer to allow communication and indexing of the Obsidian Blockchain. The codebase is JavaScript-centric and will be utilizing the NodeJS environment and Express framework for running a server with accessible routes.

## Prerequisites
##### NodeJS Installation
1. [NodeJS Download Mac/Windows](https://nodejs.org/en/download/)
2. [NodeJS Download Ubuntu](https://github.com/nodesource/distributions#installation-instructions)

###### Installing latest NodeJS on Ubuntu 16.04
```
# Install Node.js v9.x Using Ubuntu
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```

After installing NodeJS you may need to symlink it properly or you might see an error such as:
```
/usr/bin/env: ‘node’: No such file or directory
```

To symlink `nodejs` run the following command:
```
ln -s /usr/bin/nodejs /usr/bin/node
```

##### PostgreSQL Installation

###### Installing PostgreSQL on Mac
I recommend the simplest route which is via the [Postgres.app](http://postgresapp.com/). You can of course install from source or via [Homebrew](https://www.postgresql.org/download/macosx/).

###### Installing PostgreSQL on Ubuntu 16.04
Install PostgreSQL through the `apt-get` package manager:
```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

## Installation
Once you have both NodeJS and PostgreSQL available and running on your machine you can begin installing the rest of this application. First you will need to download the repo, then setup the PostgreSQL user/database, and finally install the Node dependencies used in this project.

#### Download Repo
```
$ git clone git@github.com:Manbearpixel/ObsidianNodeJSAPI.git
```

#### Setup PostgreSQL User
To enter the `psql` interface you can either run `psql` or `sudo -u postgres psql` if on Ubuntu. This will switch to the `postgres` user and enter the `psql` interface.
```
# Enter the PSQL command line:
sudo -u postgres psql
# Create the sqljs role/user:
CREATE ROLE sqljs WITH LOGIN PASSWORD 'foobar123';
# Create the odn_beta database and set the owner to sqljs
CREATE DATABASE odn_beta OWNER sqljs;
```

#### Install NodeJS Dependencies
Running the below command from within the project folder will look at the `package.json` manifest and install dependencies listed.
```
npm install
```

SequelizeJS is the ORM this API uses to manage interactions with the PostgreSQL database. You will need to install `sequelize-cli` globally via NPM to migrate the schemas.
```
npm install -g sequelize-cli
```

## Running / Development
In order to run this project you will need to make sure your Obsidian-QT GUI wallet is running, or you have the `obsidiand` process running in the background. You will additionally need to make sure you have setup `JSON-RPC` information within your `obsidian.conf` file which will be located in your Obsidian Folder.
- On MacOS, this is found in `~/Library/Application\ Support/ObsidianQT/`.
- On Ubuntu/Linux, it should be found within `~/.obsidian/`.

#### Obsidian.Conf Setup
Please make sure you have the following information in your configuration file to ensure this application can communicate with the Obsidian Blockchain running on your machine.
```
server=1
txindex=1
rpcuser=me
rpcpassword=123
rpcport=8332
```
If you would like to change any of the information above, you will also need to update the JSON-RPC file: `./server/helpers/obsidian.js`.

#### Running Database Migrations
When you are first setting up you will need to run the Migration files for PostgreSQL which contain the structure of the `odn_alpha1` database:
```
sequelize db:migrate
```
If later on you would like to empty your database, or undo migrations you can run:
```
# undo LAST migration
sequelize db:migrate:undo

# undo ALL migrations
sequelize db:migrate:undo:all
```

#### Running the API
To start running the API, execute the command `npm run start` from the application root. By default, debug information will not be shown. If you would like to run the API with debugging on, execute the command `npm run start-debug`.

With the API running, you should now be able to access the test path locally via `http://localhost:3000/ping`. If you see the JSON response with `success` you are good to start crawling the Obsidian Blockchain, so long as your Obsidian-QT wallet or Obsidiand process is caught up or has blocks for you to crawl.

#### API Routes Available
Currently the API can provide information about a Block height/hash, A Transaction hash, an Address hash, or a general search. Responses will be documented later.

##### Will be added later

## Further Reading / Useful Links
Here are some useful PSQL (PostgreSQL) commands you can run to inspect the database.
To use these commands you will need to first connect to the `odn_alpha1` database:
```
\connect odn_beta
```
