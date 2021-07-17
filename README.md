<p align="center">
  <img width="260" src="https://cdn.tolfix.com/images/TX-Small.png">
  <br/>
  <strong>D</strong>ockerize <strong>M</strong>y <strong>C</strong>ontinuous <strong>D</strong>eployment - dmcd
</p>

# ⭐ | DMCD
DMCD is being used to auto deploy apps, it uses a webhook to know when there is a new image ready to pull,
then pulls it and recreats a new container ready for production. This webhook can be used in [`hub.docker.com`](https://hub.docker.com/), or what suits the best.

# 🧿 | Status
[![Install script tester](https://github.com/Tolfix/dmcd/actions/workflows/test-install-script.yml/badge.svg)](https://github.com/Tolfix/dmcd/actions/workflows/test-install-script.yml) [![CodeQL](https://github.com/Tolfix/dmcd/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Tolfix/dmcd/actions/workflows/codeql-analysis.yml)

# 📢 | Contribute
Want to contribute? Great! You can contribute by `forking` this repository, then make changes and make a `PR`!
If you get confused and doesn't understand something, there is [`documentation`](https://github.com/Tolfix/dmcd/wiki/Documentation) *(being worked on)*.

Or simple ask on our [`discord server`](https://discord.com/invite/xHde7g93Yh).

# ❗ | Requirements
* A linux server.
* A mongodb database.
* Docker installed.
* Docker-compose installed.

# 📝 | Installation
1. Install repo: `git clone https://github.com/Tolfix/dmcd.git`
2. Install typescript: `npm i typescript -g`
3. Run: `npm install`
4. Run: `npm run build`
5. Follow setup by doing: `npm run setup`
6. Once done run: `npm run start`

# ▶ | Running
You can run it however you feel like, but the most effectiv way is using `pm2`

### Normal
Run `npm run start` and it will run as usual.

### PM2
1. Install pm2: `npm i pm2 -g`
2. Start by running: `pm2 start npm -- start`

# 🔐 | Logging in
Default user is `admin`, and password is the password you got prompted to type in `setup`

# 💾 | OS Support
| OS            | Supported     |
| ------------- |:-------------:|
| Ubuntu        |             |
| CentOS        | ❌            |
| Windows       | ❌            |
| MacOS         | ❌            |
