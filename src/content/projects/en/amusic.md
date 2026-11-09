---
translationKey: amusic
order: 8
locale: en
title: amusic
description: Apple Music on Linux with Discord Rich Presence
href: ""
sourceUrl: https://github.com/rxtsel/amusic
detailPage: true
publishDate: 2025-03-28
stack:
  - rust
tags: []
---

## I wanted Discord to show what I was listening to

When I used Apple Music on Linux, I wanted my friends to see what I was listening to in Discord, the way they could with Spotify. I used [Apple Music on the web](https://music.apple.com/?ref=rxtsel.dev) because there was no official Linux app, and that integration was missing.

I built amusic to handle it. It's a Linux desktop app that opens the web version of Apple Music and shares playback activity with Discord.

## Apple Music web, Rust and MPRIS

On Linux, [MPRIS](https://specifications.freedesktop.org/mpris-spec/latest/?ref=rxtsel.dev) lets you query what a media player is playing and its playback state. I used that information to connect Apple Music to Discord.

I wrote the logic in Rust and wrapped Apple Music web in a WebView. The Discord integration uses an SDK to show a “Listening to Apple Music” activity with the track, artwork and playback progress.

It also responds to track changes, pauses and resumed playback. I wanted the activity to follow what I was listening to without having to update anything manually.

## My own app for a couple of years

I used amusic as my Apple Music app on Linux for a couple of years. I built it for myself, shared it, and other people who wanted the same integration used it too.

I've since switched to YouTube Music, so I no longer use amusic day to day. While I did, it handled exactly what I needed.
