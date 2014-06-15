# SsunnelJS

An easy ssh-tunnel web ui tool.

## Usage

You can just use command below:

```shell
$ node ssunnel.js
```

Or use `pm2` and other daemons:

```shell
$ pm2 start ssunnel.js
```

Visit `http://localhost:3721/`, input `remote host`, `remote port`, `local port`, `username` and `password`.

Click `Add` button to add the tunnel to list. Then you can connect it, disconnect it and delete it.

## Bugs and Contributions

If you find a bug, please report it using the [issue tracker](https://github.com/XadillaX/ssunneljs/issues).
