# Facturation-pro

A small TS/JS client for FacturationPro API.

**⚠️ This project is under development. As a result, only a small part of the facturationAPI is implemented. Feel free to submit pull request.**

## To develop

- Install `NodeJS` and `npm`.
- Git clone the project.
- Install dependencies using `npm i`.

## How to publish new version on npm package registry

You must have a npm account and have appropriate right to the facturation-pro module.

Follow these steps:

- `npm login`
- Commit your changes but don't push it yet
- `npm version vX.X.X`
- Push to this repository `git push origin master --tags`
- `npm publish`

After that. Don't forget to run `npm update facturation-pro` on your project.
