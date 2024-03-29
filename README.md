<p align="center">
  <a href="https://tolfix.com/" target="_blank"><img width="260" src="https://cdn.tolfix.com/images/TX-Small.png"></a>
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
* *A mongodb database*.
* *Docker installed*.
* *Docker-compose installed*.

# 📝 | Installation
You can simply run this command as `root` user. And it will automatically install everything you need.
```bash
curl -o install.sh https://raw.githubusercontent.com/Tolfix/dmcd/master/install.sh && bash install.sh
```
Once done it will be installed in `/var/dmcd`!
<!-- 1. Install repo: `git clone https://github.com/Tolfix/dmcd.git`
2. Install typescript: `npm i typescript -g`
3. Run: `npm install`
4. Run: `npm run build`
5. Follow setup by doing: `npm run setup`
6. Once done run: `npm run start` -->

# ▶ | Running
You can run it however you feel like, but the most effectiv way is using `pm2`

### Normal
Run `npm run start` and it will run as usual.

### PM2
1. Install pm2: `npm i pm2 -g`
2. Start by running: `pm2 start npm -- start`

# 🔐 | Logging in
Default user is `admin`, and password is the password you got prompted to type in `setup` or by the `installation` script.

# 💾 | OS Support
| OS            | Supported     |
| ------------- |:-------------:|
| Ubuntu        | ✔            |
| CentOS        | ❌            |
| Windows       | ❌            |
| MacOS         | ❌            |

# 🔮 | Discord
[![Discord](https://discord.com/api/guilds/833438897484595230/widget.png?style=banner4)](https://discord.gg/xHde7g93Yh)

# ⚙ | Tolfix
**Tolfix** is a `company` focusing about `IT`, `Development` and `Networking`, we drive to help others with their `problems` when it comes to `IT` and love contributing to others.
Want to find more information about us you can visit us at [`https://tolfix.com/`](https://tolfix.com/).
