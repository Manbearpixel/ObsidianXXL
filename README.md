# ObsidianXXL
###### v0.1.1 (BETA)
---
The ObsidianXXL is a modular dashboard for MasterNodes on the Obsidian Blockchain. With a straight forward setup, holders of MasterNodes will be able to easily view their Node information in a beautiful and clean interface. The ObsidianXXL includes an internal API layer which works as a proxy between the Webapp and your running Obsidian Blockchain.

Unfortunately we are still streamlining an automated installation process, but in the meantime please read through the ObsidianXXL and XXL-API README.

## Prerequisites
##### :// Obsidian Wallet/Node
As the ObsidianXXL utilizes the Obsidian Blockchain you will need to ensure that you have properly installed either the Graphic Interface `Obsidian-QT` or the binary file `obsidiand` and you have the following information set in your `obsidian.conf` file which will be located in your Obsidian Folder.
- On MacOS, this is found in `~/Library/Application\ Support/ObsidianQT/`
- On Ubuntu/Linux, it should be found within `~/.obsidian/`

##### `obsidian.conf`
```
server=1
rpcuser=me
rpcpassword=123
rpcport=8332
```

##### :// XXL-API
The XXL-API is an interface layer separating the ObsidianXXL Webapp and your running Obsidian Blockchain. The XXL-API has it's own prerequisites and should be installed prior to ObsidianXXL. Please refer to the XXL-API `README` for more information.

##### :// Forever
Forever is a Process Manager to run the ObsidianXXL Webapp in production, essentially a high-level container for ObsidianXXL to run. We have opted for Forever due to the simplicity of use. The following command will install it in your environment.
```
npm install forever -g
```

## Installation
Running the below command from within the ObsidianXXL project folder will look at the `package.json` manifest and install the required dependencies.
```
npm install
```

## Running
### Start Obsidian Blockchain
If you have adjusted the `obsidian.conf` file while the Obsidian Blockchain was running in the background, you will need to restart it. This can be done by closing the application/process and starting it up again.

##### Obsidian-QT
If using the GUI, you will simply need to start the Obsidian-QT application.

##### obsidiand binary file
If you built the `obsidiand` binary file you will need to start the process back up again. To run `obsidiand` in the background, you can pass the `daemon` flag to daemonize the program: `obsidiand -daemon`.

### Start the ObsidianXXL Webapp
To start the ObsidianXXL Webapp simply run the following command from the ObsidianXXL project root:
```
npm run start
```

## Stopping
### Stop Obsidian Blockchain
##### Obsidian-QT
If using the GUI, you will simply need to quit the Obsidian-QT application.

##### obsidiand binary file
If you built the `obsidiand` binary file you can stop it by sending the `stop` command to the process: `obsidiand stop`.

### Stop the ObsidianXXL Webapp
To stop the ObsidianXXL Webapp simply run the following command from the ObsidianXXL project root:
```
npm run stop
```
