## empowercloud-web

### clone

submoduleも一緒にcloneする

```shell
git clone git@github.com:shukubota/empowercloud-web.git --recursive
```

### develop

```bash
yarn
yarn run proto:generate
yarn dev
```

then open

```shell
http://localhost:3008
```

### apply the latest protobuf

```shell
yarn run proto:generate
```

でgen配下にinterfaceを定義したファイルができる

