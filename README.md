# SsunnelJS

An easy ssh-tunnel web ui tool.

## Prepare

### For M$ Windows Users

At first you should generate a pair of public key and private key for your ssh connection.

Enter folder `ssh` and open `puttygen.exe`, generate keys and save public and private keys to `ssh` folder.

Open public key and copy the whole content to `~/.ssh/authorized_keys` file of your remote host.

### For Linux Users

In developing...

## Usage

You can just use command below:

```shell
$ node ssunnel.js
```

Or use `pm2` and other daemons:

```shell
$ pm2 start ssunnel.js
```

Visit `http://localhost:3721/`, input `remote host`, `remote port`, `local port`, `username` and `private key filename`.

Click `Add` button to add the tunnel to list. Then you can connect it, disconnect it and delete it.

## Bugs and Contributions

If you find a bug, please report it using the [issue tracker](https://github.com/XadillaX/ssunneljs/issues).
