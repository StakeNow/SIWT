---
id: intro
title: Intro
---

The SIWT Discord bot can be used to allow your Discord members to identitfy themselves using their Tezos wallet. The bot automatically assigns the `Verified` role if your user successfully signs in and passes the requirements you set in the [Access control query](https://github.com/StakeNow/SIWT/tree/develop/packages/acq)

## How it works

### On activation

When activating the bot it will create a role called `Verified`, create a channel called verification and send a message to it.
The message contains a button labeled `Verify`.

### The flow

When a user clicks the button, a verification attempt will be created in the DB.
A new message will be sent to the user with a button labeled `Let's go`.
This button will direct the user to the ui you've deployed earlier together with the ID of the verification attempt.

Once the user arrives at the UI, the user will be requested to connect their wallet and sign a message.
After signing the message, the UI will attempt to contact the bot to verify the signature and to check if this user meets
the requirements set in the Access control query.

If the signature is valid and the user meets the requirements, the `Verified` role will automatically be applied to the user.
The user will now have access to your private channels with the `Verified` role permission requirements.

## Support

For support please reach out on our [Discord](https://discord.com/invite/6J3bjhkpxm?utm_source=GH&utm_medium=GH&utm_campaign=GH)

