# ObsidianXXL
###### v0.1.1 (BETA)
---
The ObsidianXXL *(XXL)* is a modular dashboard for MasterNodes *(MN)* on the Obsidian Blockchain. With a straight forward setup, holders of MasterNodes will be able to easily view their Node information in a beautiful and clean interface. The ObsidianXXL includes an internal API layer, *XXL-API*, which works as a proxy between this Webapp and your running Obsidian Blockchain.

A more streamlined installation process is still being sorted out as we are growing to understand our userbase and which platforms will need support. Currently, installation has been verified on MacOS and Ubuntu 16.04. In order of importance, the [XXL-API](./xxl-api) should be installed first.

## Prerequisites
*Important project dependencies such as NodeJS are installed after going through the entire [XXL-API `README`](./xxl-api/README.md)!*

### :// Obsidian Wallet/Node
If you have not yet installed either the [Obsidian-QT Wallet](https://github.com/obsidianproject/Obsidian-Qt/releases) or the `obsidiand` binary file from source. For more information, please view our [Github Wiki](https://github.com/obsidianproject/Obsidian-Qt/wiki).

### :// XXL-API
The XXL-API is an interface layer separating the ObsidianXXL Webapp and your running Obsidian Blockchain. The XXL-API has it's own prerequisites/guide and should be installed prior to ObsidianXXL. Please refer to the [XXL-API `README`](./xxl-api/README.md) for more information.

### :// Forever
Forever is a Process Manager to run the ObsidianXXL Webapp in production, essentially a high-level container for ObsidianXXL to run. We have opted for Forever due to the simplicity of use. The following command will install it in your environment.
```
npm install forever -g
```

## Installation
Running the below command from within the ObsidianXXL project folder will look at the `package.json` manifest and install the required dependencies. If you do not have the ObsidianXXL project folder then you have not read through and setup the [XXL-API `README`](./xxl-api/README.md) and must do that first!
```
npm install
```

## Running
### :// 1 - Start Obsidian Blockchain
Please ensure the following steps are done:
1. The Obsidian Blockchain is running in the background, either as a Wallet App or via the `obsidiand` process. 
2. You have modified the `obsidian.conf` file with specific settings listed above.
  - *If you have modified your Obsidian Blockchain config file you must reset your application/process first!*

##### Obsidian-QT
If using the GUI, you will simply need to start the Obsidian-QT application.

##### obsidiand binary file
If you built the `obsidiand` binary file you will need to start the process back up again. To run `obsidiand` in the background, you can pass the `daemon` flag to daemonize the program: `obsidiand -daemon`.

### :// 2 - Start ObsidianXXL
Run the following command from the ObsidianXXL project root:
```
npm run start
```
If no issues arise you should see a message in your shell that the server is running on port `:80`, this means you should be able to see your dashboard running by entering the IP address of your machine.

## ObsidianXXL Commands
All of these commands are run using `npm` from the ObsidianXXL project root.

##### :// Start ObsidianXXL
```
npm run start
```

##### :// Stop ObsidianXXL
```
npm run stop
```

##### :// Update ObsidianXXL
```
npm run update
```
