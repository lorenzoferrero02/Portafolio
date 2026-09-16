---
title: "HTB - Forest"
date: "2024-01-15"
description: "Windows AD machine, AS-REP roasting + DC sync"
platform: "HackTheBox"
difficulty: "Easy"
tags: ["active-directory", "windows", "asrep-roasting"]
---

## Enumeration

Partiamo con un `nmap` per vedere le porte aperte:

```bash
nmap -sC -sV -p- 10.10.10.161