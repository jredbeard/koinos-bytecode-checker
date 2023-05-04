# Koinos Bytecode Checker

## What is this?

This is a simple command line tool that allows you to check the bytecode (hash and size) of smart contracts uploaded to the Koinos blockchain. It uses the account history API (which is optionally available) in Koinos nodes.

## Why would you want to do that?

This allows you to verify that a contract uploaded to the Koinos blockchain actually is the code that you think it is. Keep in mind, contracts on Koinos can either be immutable or not immutable - this means that there may be multiple uploads of the same contract (this tool will find all of them if there are more).

## How do I use it?

As long as you have `node` installed on your local machine, simply run:

```
npm install
node index.js <contract id>
```

And that's it.

If you need to specify a different node, set the environment variable NODE_API.

## TO-DO List for this currently very simple project

- Write instructions (and potentially a docker container and scripts) to compile and list the hash and size of supplied contract code.
- Add a `Dockerfile` for this tool so you can easily run it that way.
- Automate both of the above pieces into one flow (compile provided source and get hash/size, check the chain for matches on a contract ID as well as non-matches on a contract ID)

Pull requests to this repo are welcome as I'm usually very busy.

This software is inspired by and uses code from [Fogata](https://github.com/joticajulian/fogata) by Julián González (thanks!)