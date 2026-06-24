## [4.0.0](https://github.com/wxsms/bilibili-video2mp3/compare/v3.1.0...v4.0.0) (2026-06-24)

### Features

* add ffmpeg check, custom output dir, and unicode icons ([18ffe47](https://github.com/wxsms/bilibili-video2mp3/commit/18ffe471d155ebb2a978afd03b234b4501041cf8))
* add interactive CLI mode with @clack/prompts ([b010143](https://github.com/wxsms/bilibili-video2mp3/commit/b01014318665d562ae72a395fd7fe2baa18f4e90))
* improve interactive flow with URL validation and confirm-first UX ([24dcf28](https://github.com/wxsms/bilibili-video2mp3/commit/24dcf287fa6a4da6f50ad283d49a85d6ee77de74))
* select all episodes by default in interactive mode ([3e69eba](https://github.com/wxsms/bilibili-video2mp3/commit/3e69eba9bdd7624fe5e18f5505aaf4cb4529278e))

### Bug Fixes

* add explicit pnpm install step for action-setup v4 ([beac5e6](https://github.com/wxsms/bilibili-video2mp3/commit/beac5e6f58a83fb0580fc399cf86969fb45899fb))
* change -ff to -f for commander v14 compatibility ([63659d3](https://github.com/wxsms/bilibili-video2mp3/commit/63659d3790a662fb8d046b426f6a70864a69f006))
* correct CI workflow YAML structure and separate e2e-mock job ([069ce0f](https://github.com/wxsms/bilibili-video2mp3/commit/069ce0f337eefffbd98f25cada2085ecb329eb96))
* correct YAML indentation in CI workflow files ([073d71e](https://github.com/wxsms/bilibili-video2mp3/commit/073d71e6d56cc3ff4dc7b6d6e672618506f5ade1))
* **deps:** pin dependency filenamify to 6.0.0 ([#189](https://github.com/wxsms/bilibili-video2mp3/issues/189)) ([f472e17](https://github.com/wxsms/bilibili-video2mp3/commit/f472e178d8832bf1425dbb66d487684e59aa0006))
* **deps:** pin vite@8.0.16 and form-data@4.0.6 to resolve audit vulnerabilities ([5733c2d](https://github.com/wxsms/bilibili-video2mp3/commit/5733c2d4fc2f20a2e32fd6744e705cce0e611912))
* **deps:** update dependency @ffmpeg/core to v0.12.10 ([f77b9c7](https://github.com/wxsms/bilibili-video2mp3/commit/f77b9c74034924cae74980c9b5eff79e76e0b2d7))
* **deps:** update dependency @ffmpeg/ffmpeg to v0.12.15 ([8330018](https://github.com/wxsms/bilibili-video2mp3/commit/8330018cea76aff175f67408dfa622bf98d630be))
* **deps:** update dependency axios to v1.15.2 [security] ([4d093e7](https://github.com/wxsms/bilibili-video2mp3/commit/4d093e7af498d927e1e9b5e10d5ca61a4ae4879e))
* **deps:** update dependency axios to v1.16.1 ([a718e09](https://github.com/wxsms/bilibili-video2mp3/commit/a718e09dc12925f886e93b23f428015940908b23))
* **deps:** update dependency axios to v1.17.0 ([#230](https://github.com/wxsms/bilibili-video2mp3/issues/230)) ([5c0e865](https://github.com/wxsms/bilibili-video2mp3/commit/5c0e865e369898678130aa8682699a676e53f0b6))
* **deps:** update dependency axios to v1.18.1 ([479fbef](https://github.com/wxsms/bilibili-video2mp3/commit/479fbef5bc9fc5fde5352ccef73a119866461bcb))
* **deps:** update dependency axios to v1.7.8 ([#191](https://github.com/wxsms/bilibili-video2mp3/issues/191)) ([10810ac](https://github.com/wxsms/bilibili-video2mp3/commit/10810ac3a1d4cd33619f8a6dc1ee27ff5727a24f))
* **deps:** update dependency axios to v1.7.9 ([#194](https://github.com/wxsms/bilibili-video2mp3/issues/194)) ([98cc6a4](https://github.com/wxsms/bilibili-video2mp3/commit/98cc6a4514b957eabbc73c1f85e23d8da4991ed6))
* **deps:** update dependency commander to v14 ([557f9d0](https://github.com/wxsms/bilibili-video2mp3/commit/557f9d0b5af5a9e1254703599974b48b2fccf8f9))
* **deps:** update dependency commander to v15 ([9ea2701](https://github.com/wxsms/bilibili-video2mp3/commit/9ea270116325d8735779fd700ab6ab4d9ebc963b))
* **deps:** update dependency filenamify to v7 ([bd733da](https://github.com/wxsms/bilibili-video2mp3/commit/bd733daefa857ce3b151affbf54b04dacd940371))
* **deps:** update dependency filenamify to v7.0.2 ([fe1e97c](https://github.com/wxsms/bilibili-video2mp3/commit/fe1e97c4566ff51f8d5dec84699e59274edcdac4))
* **deps:** update dependency lodash-es to v4.18.1 [security] ([8a40f00](https://github.com/wxsms/bilibili-video2mp3/commit/8a40f00c3acc111dfc03fc200521d2649efb8bf4))
* read coverage from coverage-final.json instead of coverage-summary.json ([5c263b0](https://github.com/wxsms/bilibili-video2mp3/commit/5c263b0995323b1bec96ce277ac7ce205357a39c))
* reset cursor position after progress bars on exit ([47cf586](https://github.com/wxsms/bilibili-video2mp3/commit/47cf586871492e4d7b7ccbddbab206a5d4696210))
* resolve lint errors in test files without adding eslint rules ([e4dfb90](https://github.com/wxsms/bilibili-video2mp3/commit/e4dfb90e293792151d1c2baf51c7b57a9113af2d))
* update CI workflow to use new entry point path ([48d9ec8](https://github.com/wxsms/bilibili-video2mp3/commit/48d9ec8f90621e5b53e8f077d665813c6ec26dd1))
* update lockfile for axios 1.16.1 ([1cffd6a](https://github.com/wxsms/bilibili-video2mp3/commit/1cffd6a5fb4d8de6215078563112440adc538ead))
* use local eslint instead of npx to avoid pulling incompatible version ([8930afa](https://github.com/wxsms/bilibili-video2mp3/commit/8930afafee70857c73b8b0dd0a9c637e4d64ddf0))
* use pnpm run lint to resolve local bin path ([b6762a4](https://github.com/wxsms/bilibili-video2mp3/commit/b6762a4408b846bcbb93cb6cf23e7771903bdc20))

## [3.1.0](https://github.com/wxsms/bilibili-video2mp3/compare/v3.0.1...v3.1.0) (2024-11-05)

### Features

* add filenamify ([d856d9a](https://github.com/wxsms/bilibili-video2mp3/commit/d856d9a8f0b05520aca1c785b535ba15e521f230))

### Bug Fixes

* **deps:** update dependency axios to v1.7.2 ([99155a9](https://github.com/wxsms/bilibili-video2mp3/commit/99155a9d96b624e783726dbef2e2ea68cc382156))
* **deps:** update dependency axios to v1.7.3 ([2b477a0](https://github.com/wxsms/bilibili-video2mp3/commit/2b477a0df3fa9d009b52907c9446fd1c8fbf747b))
* **deps:** update dependency axios to v1.7.4 [security] ([686da71](https://github.com/wxsms/bilibili-video2mp3/commit/686da71b2444f4235bc1fe67a3de124265465946))
* **deps:** update dependency axios to v1.7.5 ([bdc0996](https://github.com/wxsms/bilibili-video2mp3/commit/bdc09960e62ff83b1b4477c6d5cbc39317f0acdb))
* **deps:** update dependency axios to v1.7.7 ([19305e9](https://github.com/wxsms/bilibili-video2mp3/commit/19305e949fa75380e32e4770d6cae7e370137734))

## [3.0.1](https://github.com/wxsms/bilibili-video2mp3/compare/v3.0.0...v3.0.1) (2024-04-03)

### Bug Fixes

* **deps:** update dependency axios to v1.6.3 ([c836094](https://github.com/wxsms/bilibili-video2mp3/commit/c83609474429ee279db2f6ed5c0b3022b8a0a46c))
* **deps:** update dependency axios to v1.6.4 ([821ed12](https://github.com/wxsms/bilibili-video2mp3/commit/821ed124406f8fe482195b399743aeb33f4029dc))
* **deps:** update dependency axios to v1.6.5 ([3c8b716](https://github.com/wxsms/bilibili-video2mp3/commit/3c8b716656d55a037761488c3939cc2f25373b35))
* **deps:** update dependency axios to v1.6.7 ([59eb0a5](https://github.com/wxsms/bilibili-video2mp3/commit/59eb0a5cabb9787c851d25f20182ffb471600610))
* **deps:** update dependency axios to v1.6.8 ([8e0b550](https://github.com/wxsms/bilibili-video2mp3/commit/8e0b550578e757d9466d614d01de69ded770bda4))
* ff args for system installation ([c260d26](https://github.com/wxsms/bilibili-video2mp3/commit/c260d26f320c46d2251f2f387ae29ec3a50114bb))

## [3.0.0](https://github.com/wxsms/bilibili-video2mp3/compare/v2.2.1...v3.0.0) (2023-12-17)

### Features

* bli api update & node v18 support ([b9c655c](https://github.com/wxsms/bilibili-video2mp3/commit/b9c655c75048ce54b5b7e5b1748d8062197c0533))
* cut from & to ([09548cf](https://github.com/wxsms/bilibili-video2mp3/commit/09548cf188c74b09a40a36d6fdcd0b09d643f019))
* ff options ([507f444](https://github.com/wxsms/bilibili-video2mp3/commit/507f444206fa640c25548253ccc8c6fee1e57f0c))
* rollback ffmpeg.wasm since higher version does not support nodejs ([4c5a757](https://github.com/wxsms/bilibili-video2mp3/commit/4c5a757f899b47a429ad8337659924a2f81362a0))

### Bug Fixes

* **deps:** update dependency @ffmpeg/core to v0.12.4 ([#118](https://github.com/wxsms/bilibili-video2mp3/issues/118)) ([03e03cb](https://github.com/wxsms/bilibili-video2mp3/commit/03e03cbb31ee5a68e36f0c3ae3698407b55beea3))
* **deps:** update dependency @ffmpeg/ffmpeg to v0.12.7 ([#119](https://github.com/wxsms/bilibili-video2mp3/issues/119)) ([9a3a442](https://github.com/wxsms/bilibili-video2mp3/commit/9a3a4420290c78e4a1bdb8a6ead8026c6134b854))
* **deps:** update dependency axios to v1.6.1 ([8967eda](https://github.com/wxsms/bilibili-video2mp3/commit/8967eda4c7dd340ba0775e8381e513fcfec24763))
* **deps:** update dependency axios to v1.6.2 ([11c3d4f](https://github.com/wxsms/bilibili-video2mp3/commit/11c3d4f7129bb36b70c2e8840426d15e9a9d7746))

## [2.2.1](https://github.com/wxsms/bilibili-video2mp3/compare/v2.2.0...v2.2.1) (2023-10-31)

### Features

* adjust options ([3f56056](https://github.com/wxsms/bilibili-video2mp3/commit/3f56056c1ffde1a3c64fde4cadeab82922bb8c78))

### Bug Fixes

* **deps:** update dependency axios to v1.3.5 ([#100](https://github.com/wxsms/bilibili-video2mp3/issues/100)) ([1678833](https://github.com/wxsms/bilibili-video2mp3/commit/167883336b2caccd2c0a675ce4790f268cd19351))
* **deps:** update dependency axios to v1.3.6 ([6d4dca3](https://github.com/wxsms/bilibili-video2mp3/commit/6d4dca3213478661b828146dc95cb9e581935007))
* **deps:** update dependency axios to v1.4.0 ([670ecf5](https://github.com/wxsms/bilibili-video2mp3/commit/670ecf5edb42cb0c17ca35e2d1b892718aaf4261))
* **deps:** update dependency axios to v1.5.0 ([477aff4](https://github.com/wxsms/bilibili-video2mp3/commit/477aff4c7d505b51ade1d299381b8c7034e84d1b))
* **deps:** update dependency axios to v1.5.1 ([33c61c2](https://github.com/wxsms/bilibili-video2mp3/commit/33c61c20ac92401ed5e2f4cc58f161dc61ab1d5b))
* **deps:** update dependency axios to v1.6.0 ([74fb2c4](https://github.com/wxsms/bilibili-video2mp3/commit/74fb2c4db92728cb99b7396f77323543352e6dd5))
* **deps:** update dependency commander to v10.0.1 ([fac2b06](https://github.com/wxsms/bilibili-video2mp3/commit/fac2b061834d9fad76685ebcfa866c8acb777549))
* **deps:** update dependency commander to v11 ([#111](https://github.com/wxsms/bilibili-video2mp3/issues/111)) ([4282323](https://github.com/wxsms/bilibili-video2mp3/commit/428232331601d1418d5e88ea74375795f35292a4))
* **deps:** update dependency commander to v11.1.0 ([14edc54](https://github.com/wxsms/bilibili-video2mp3/commit/14edc542a93bd388a5f01bf58b4db0823b26e8da))
* initial state parse fail ([7a52876](https://github.com/wxsms/bilibili-video2mp3/commit/7a528762e537a4b7b32d4eacac16e2afa90c47bb))

## [2.2.0](https://github.com/wxsms/bilibili-video2mp3/compare/v2.1.0...v2.2.0) (2023-04-04)

### Features

* concurrent mp3 convert ([c9b4442](https://github.com/wxsms/bilibili-video2mp3/commit/c9b4442a0b0c2e075968569f7bf057b8eda18e8b))

## [2.1.0](https://github.com/wxsms/bilibili-video2mp3/compare/v2.0.7...v2.1.0) (2023-03-29)

### Features

* better threads instead of thunk ([b9f486b](https://github.com/wxsms/bilibili-video2mp3/commit/b9f486b5dcbf773ffaf83ff1941494dac00a12ba))

## [2.0.7](https://github.com/wxsms/bilibili-video2mp3/compare/v2.0.6...v2.0.7) (2022-07-29)

## [2.0.6](https://github.com/wxsms/bilibili-video2mp3/compare/v2.0.5...v2.0.6) (2022-07-29)

## [2.0.5](https://github.com/wxsms/bilibili-video2mp3/compare/v2.0.4...v2.0.5) (2022-07-29)

## [2.0.4](https://github.com/wxsms/bilibili-video2mp3/compare/v2.0.3...v2.0.4) (2022-07-05)

## [2.0.3](https://github.com/wxsms/bilibili-video2mp3/compare/v2.0.2...v2.0.3) (2022-01-23)

### Bug Fixes

* indexoffset option ([b981e73](https://github.com/wxsms/bilibili-video2mp3/commit/b981e73e063394460fb226f730ce9ab0c4254c18))

## [2.0.2](https://github.com/wxsms/bilibili-video2mp3/compare/v2.0.1...v2.0.2) (2022-01-23)

### Bug Fixes

* indexoffset option ([a34791e](https://github.com/wxsms/bilibili-video2mp3/commit/a34791ed633170c130410090839a38516dd0cd8c))

## [2.0.1](https://github.com/wxsms/bilibili-video2mp3/compare/v2.0.0...v2.0.1) (2022-01-22)

### Bug Fixes

* minor tweaks ([07cb9f6](https://github.com/wxsms/bilibili-video2mp3/commit/07cb9f64d8173034f5b6ee23ab6f935f562c2d45))

## [2.0.0](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.8...v2.0.0) (2022-01-22)

### Features

* change package name ([46bf80d](https://github.com/wxsms/bilibili-video2mp3/commit/46bf80d2daed8f9ddcec2ca25b4ccb751478f361))

## [1.0.8](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.7...v1.0.8) (2022-01-22)

### Bug Fixes

* 2mp3 fail stuck process ([b525cd4](https://github.com/wxsms/bilibili-video2mp3/commit/b525cd44bd32b30f1600c652aa16625c72a78843))
* print log only when debug option provided ([4166a39](https://github.com/wxsms/bilibili-video2mp3/commit/4166a39502b4252b4986a04daf4bbb7d10798905))

## [1.0.7](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.6...v1.0.7) (2022-01-22)

### Bug Fixes

* download crash ([006532a](https://github.com/wxsms/bilibili-video2mp3/commit/006532a6808fd4a3ac546a33fd5e165a38332c93))

## [1.0.6](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.5...v1.0.6) (2022-01-22)

### Bug Fixes

* remove renderThrottle ([348b3fa](https://github.com/wxsms/bilibili-video2mp3/commit/348b3fa61301c5530a173f23b1fa6b814bcef078))
* throw on socket error ([7d94698](https://github.com/wxsms/bilibili-video2mp3/commit/7d946988306438cf444b3b0b6e1c254fa3acce94))

## [1.0.5](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.4...v1.0.5) (2022-01-22)

### Bug Fixes

* progress bar align ([5ed2a07](https://github.com/wxsms/bilibili-video2mp3/commit/5ed2a07345386b59b63a9b905ad544eba713fa54))

## [1.0.4](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.3...v1.0.4) (2022-01-22)

### Bug Fixes

* progress bar align ([97cde9f](https://github.com/wxsms/bilibili-video2mp3/commit/97cde9f7bfaaf0c780cf688675646d9ef9330ad6))

## [1.0.3](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.2...v1.0.3) (2022-01-22)

### Bug Fixes

* ensure progress bar order ([80697c4](https://github.com/wxsms/bilibili-video2mp3/commit/80697c4d306ec0ba37c374586ef97d8ea081220b))
* ffmpeg.wasm can only run one command at a time ([4392357](https://github.com/wxsms/bilibili-video2mp3/commit/43923579a9654a127faa10573aa6e92f9c82b0fc))
* proccess exit problem ([6863225](https://github.com/wxsms/bilibili-video2mp3/commit/68632257a4d89c29de3fc2d91c0f0fc00147cdd8))

## [1.0.2](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.1...v1.0.2) (2022-01-22)

### Bug Fixes

* exit ffmpeg to free memery after transform done ([90914e8](https://github.com/wxsms/bilibili-video2mp3/commit/90914e860062bc75bea8f7553533df6c9792bdfd))

## [1.0.1](https://github.com/wxsms/bilibili-video2mp3/compare/v1.0.0...v1.0.1) (2022-01-22)

### Bug Fixes

* command line argv ([fd5bffd](https://github.com/wxsms/bilibili-video2mp3/commit/fd5bffd03e3f49f9d007a37bcb93b0a034ed06dd))

## [1.0.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.9.0...v1.0.0) (2022-01-22)

### Features

* commander ([fa1847f](https://github.com/wxsms/bilibili-video2mp3/commit/fa1847f3edbf45e501b1d8839fd7085b05b82771))
* use [@ffmpeg](https://github.com/ffmpeg) wasm ([a817471](https://github.com/wxsms/bilibili-video2mp3/commit/a817471c0f241431d9ea62f420ec6e8b21d166e1))
* use axios ([4f7b066](https://github.com/wxsms/bilibili-video2mp3/commit/4f7b06648dcad6eca8d111ce5a876794b2fef13d))

## [0.9.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.8.1...v0.9.0) (2022-01-03)

### Features

* add index-offset ([45182c7](https://github.com/wxsms/bilibili-video2mp3/commit/45182c731095ea9900eb7bf76e2e08e5e7144830))
* naming pattern add INDEX ([91ab5f4](https://github.com/wxsms/bilibili-video2mp3/commit/91ab5f48ee3986d7cc2b1777c14d57414508a749))

## [0.8.1](https://github.com/wxsms/bilibili-video2mp3/compare/v0.8.0...v0.8.1) (2022-01-02)

### Bug Fixes

* leading - cause ffmpeg command fail ([dd1084d](https://github.com/wxsms/bilibili-video2mp3/commit/dd1084d960422925cccce744db38ed258cccb76c))

## [0.8.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.7.0...v0.8.0) (2022-01-02)

### Features

* add naming option ([ba7cc97](https://github.com/wxsms/bilibili-video2mp3/commit/ba7cc97f67055f2ebc63d581deba83985532ffbe))

## [0.7.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.6.4...v0.7.0) (2021-12-30)

### Features

* add from/to ([c847ce8](https://github.com/wxsms/bilibili-video2mp3/commit/c847ce855d126da7f2dd44046856787453488552))
* add threads options ([221672c](https://github.com/wxsms/bilibili-video2mp3/commit/221672cdc789b1a1340cf55e2e33d2d18ffb2145))
* remove useless code ([c410a18](https://github.com/wxsms/bilibili-video2mp3/commit/c410a18b1e4225c68f8404617478e7e6c1b0445c))

## [0.6.4](https://github.com/wxsms/bilibili-video2mp3/compare/v0.6.3...v0.6.4) (2021-12-30)

### Bug Fixes

* translate whitespace in filename ([bcbe5c4](https://github.com/wxsms/bilibili-video2mp3/commit/bcbe5c44a9def85137d38616d4992f96aa95118b))

## [0.6.3](https://github.com/wxsms/bilibili-video2mp3/compare/v0.6.2...v0.6.3) (2021-12-30)

### Bug Fixes

* add download retry ([f778058](https://github.com/wxsms/bilibili-video2mp3/commit/f778058086d97e5ca62dd3b9df68504130dd9e6a))
* ffmpeg stuck if file exist ([75875fe](https://github.com/wxsms/bilibili-video2mp3/commit/75875fe2c5e189538faef601b0e7ffbe12bb1786))

## [0.6.2](https://github.com/wxsms/bilibili-video2mp3/compare/v0.6.1...v0.6.2) (2021-12-30)

### Bug Fixes

* chunk pages in case of too much in one video ([b0ac18e](https://github.com/wxsms/bilibili-video2mp3/commit/b0ac18e52a73a5608e4a558d23e001da331e3281))

## [0.6.1](https://github.com/wxsms/bilibili-video2mp3/compare/v0.6.0...v0.6.1) (2021-12-30)

### Bug Fixes

* multiple url not work in windows ([29a52f8](https://github.com/wxsms/bilibili-video2mp3/commit/29a52f8cd203a1cd873ab8e86c9f5e1915ca4c51))

## [0.6.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.5.0...v0.6.0) (2021-12-30)

### Features

* add help ([42d2e71](https://github.com/wxsms/bilibili-video2mp3/commit/42d2e713c720edece6156ce676ffe99eb12e208f))

## [0.5.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.4.0...v0.5.0) (2021-12-30)

### Features

* allow multi url ([8a3650c](https://github.com/wxsms/bilibili-video2mp3/commit/8a3650c4fb86fe86dfb220ae5c03b22fefde5340))
* allow skip mp3 ([6948f35](https://github.com/wxsms/bilibili-video2mp3/commit/6948f3528199cba2c1fe840f40171cae1fc22a3d))

## [0.4.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.3.0...v0.4.0) (2021-12-29)

### Features

* add progressbar ([fac9dab](https://github.com/wxsms/bilibili-video2mp3/commit/fac9dabe747b5601e7548b8d0a21f43f2e8c3065))

## [0.3.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.2.1...v0.3.0) (2021-12-29)

### Features

* allow author option ([c18ef4d](https://github.com/wxsms/bilibili-video2mp3/commit/c18ef4da07eb41ed892666e7742859556b07a8ab))

## [0.2.1](https://github.com/wxsms/bilibili-video2mp3/compare/v0.2.0...v0.2.1) (2021-12-29)

### Bug Fixes

* increase mp3 quality ([22e31dd](https://github.com/wxsms/bilibili-video2mp3/commit/22e31dd63b79a10f7c0e86bb14f494650b4ddd36))

## [0.2.0](https://github.com/wxsms/bilibili-video2mp3/compare/v0.1.0...v0.2.0) (2021-12-29)

## 0.1.0 (2021-12-29)
